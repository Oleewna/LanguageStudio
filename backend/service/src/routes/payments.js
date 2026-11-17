const express = require('express');
const path = require('path');
const fs = require('fs');
const { Entitlement } = require('../models/Entitlement');
const { getPaymentProvider } = require('../services/payments');

const router = express.Router();
const projectRoot = path.resolve(__dirname, '../../../../');
const coursesDir = path.join(projectRoot, 'courses');

function readCourseJson(courseId) {
    try {
        const filePath = path.join(coursesDir, courseId, 'course.json');
        if (fs.existsSync(filePath)) {
            return JSON.parse(fs.readFileSync(filePath, 'utf8'));
        }
    } catch (e) {
        // Ignore read errors
    }
    return null;
}

/**
 * POST /api/payments/checkout
 * Initiates an offsite checkout session with the configured payment provider.
 * Requires user authentication via session.
 */
router.post('/checkout', async (req, res, next) => {
    try {
        const userId = req.session && req.session.userId;
        if (!userId) {
            return res.status(401).json({
                error: 'Authentication required to initiate checkout.',
                code: 'AUTH_REQUIRED'
            });
        }

        const { courseId, priceId: inputPriceId, successUrl, cancelUrl } = req.body || {};
        if (!courseId || typeof courseId !== 'string') {
            return res.status(400).json({
                error: 'Valid courseId is required.',
                code: 'INVALID_COURSE_ID'
            });
        }

        const safeCourseId = courseId.trim();

        // Check if user already holds active access
        const hasEntitlement = await Entitlement.hasActiveEntitlement(userId, safeCourseId);
        if (hasEntitlement) {
            return res.status(409).json({
                error: 'User already has active access to this course.',
                code: 'ALREADY_ENTITLED'
            });
        }

        // Determine priceId
        let priceId = inputPriceId;
        if (!priceId) {
            const courseData = readCourseJson(safeCourseId);
            priceId = courseData?.priceId || `price_${safeCourseId}_standard`;
        }

        const provider = getPaymentProvider();
        const checkoutSession = await provider.createCheckout({
            userId,
            courseId: safeCourseId,
            priceId,
            successUrl: successUrl || `/pages/lesson.html?course=${encodeURIComponent(safeCourseId)}&purchased=1`,
            cancelUrl: cancelUrl || `/pages/pricing.html?course=${encodeURIComponent(safeCourseId)}&canceled=1`,
            metadata: { userId, courseId: safeCourseId }
        });

        return res.status(200).json(checkoutSession);
    } catch (error) {
        return next(error);
    }
});

/**
 * POST /api/payments/webhook
 * Handles incoming provider webhooks with signature verification and idempotency.
 * Entitlements are granted or revoked ONLY from this webhook handler.
 */
router.post('/webhook', async (req, res, next) => {
    try {
        const provider = getPaymentProvider();

        // Extract signature from headers (provider-agnostic support)
        const signature =
            req.headers['x-signature'] ||
            req.headers['stripe-signature'] ||
            req.headers['x-mock-signature'] ||
            req.headers['authorization'] ||
            '';

        const isValid = provider.verifyWebhook(req.body, signature, req.headers);
        if (!isValid) {
            return res.status(400).json({
                error: 'Invalid webhook signature.',
                code: 'INVALID_SIGNATURE'
            });
        }

        const event = provider.parseEvent(req.body, req.headers);
        const { eventType, providerPaymentId, userId, courseId, expiresAt } = event;

        if (eventType === 'payment_success') {
            if (!userId || !courseId || !providerPaymentId) {
                return res.status(400).json({
                    error: 'Malformed payment_success event: missing userId, courseId, or providerPaymentId.',
                    code: 'MALFORMED_EVENT'
                });
            }

            const { entitlement, idempotent } = await Entitlement.grantEntitlement({
                userId,
                courseId,
                provider: event.provider,
                providerPaymentId,
                expiresAt
            });

            return res.status(200).json({
                received: true,
                idempotent,
                entitlement
            });
        }

        if (eventType === 'payment_refunded') {
            const result = await Entitlement.revokeEntitlement({
                providerPaymentId,
                status: 'refunded'
            });

            return res.status(200).json({
                received: true,
                action: 'refunded',
                providerPaymentId,
                modified: result.modifiedCount > 0
            });
        }

        if (eventType === 'subscription_cancelled') {
            const result = await Entitlement.revokeEntitlement({
                providerPaymentId,
                status: 'expired'
            });

            return res.status(200).json({
                received: true,
                action: 'expired',
                providerPaymentId,
                modified: result.modifiedCount > 0
            });
        }

        return res.status(200).json({
            received: true,
            ignored: true,
            eventType
        });
    } catch (error) {
        return next(error);
    }
});

/**
 * GET /api/payments/entitlement/:courseId
 * Helper to check current user entitlement state for a course.
 */
router.get('/entitlement/:courseId', async (req, res, next) => {
    try {
        const userId = req.session && req.session.userId;
        if (!userId) {
            return res.status(401).json({ authenticated: false, hasAccess: false });
        }
        const courseId = req.params.courseId;
        const hasAccess = await Entitlement.hasActiveEntitlement(userId, courseId);
        return res.json({ authenticated: true, courseId, hasAccess });
    } catch (error) {
        return next(error);
    }
});

module.exports = router;
