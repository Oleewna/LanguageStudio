/**
 * Email Service Interface and Stub Implementation
 */

class EmailService {
    async sendVerificationEmail({ to, displayName, token, verificationUrl }) {
        throw new Error('sendVerificationEmail must be implemented.');
    }

    async sendPasswordResetEmail({ to, displayName, token, resetUrl }) {
        throw new Error('sendPasswordResetEmail must be implemented.');
    }
}

class StubEmailService extends EmailService {
    constructor() {
        super();
        this.sentEmails = [];
    }

    async sendVerificationEmail({ to, displayName, token, verificationUrl }) {
        const emailRecord = {
            type: 'verification',
            to,
            displayName,
            token,
            verificationUrl: verificationUrl || `/api/auth/verify-email?token=${token}`,
            sentAt: new Date()
        };
        this.sentEmails.push(emailRecord);
        console.log(`[EmailService STUB] Verification email sent to "${to}" (Token: ${token})`);
        return { success: true, emailRecord };
    }

    async sendPasswordResetEmail({ to, displayName, token, resetUrl }) {
        const emailRecord = {
            type: 'password-reset',
            to,
            displayName,
            token,
            resetUrl: resetUrl || `/api/auth/reset-password?token=${token}`,
            sentAt: new Date()
        };
        this.sentEmails.push(emailRecord);
        console.log(`[EmailService STUB] Password reset email sent to "${to}" (Token: ${token})`);
        return { success: true, emailRecord };
    }

    getSentEmails() {
        return [...this.sentEmails];
    }

    clear() {
        this.sentEmails = [];
    }
}

let activeEmailService = new StubEmailService();

function getEmailService() {
    return activeEmailService;
}

function setEmailService(service) {
    if (!(service instanceof EmailService)) {
        throw new Error('Service must extend EmailService');
    }
    activeEmailService = service;
}

module.exports = {
    EmailService,
    StubEmailService,
    getEmailService,
    setEmailService
};
