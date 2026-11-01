(function () {
  'use strict';

  const SVG_NS = 'http://www.w3.org/2000/svg';
  let resizeObserver;
  let animationFrame = 0;

  function drawContainer(container, itemSelector, markerSelector) {
    const items = Array.from(container.children).filter((child) => child.matches(itemSelector));
    let svg = container.querySelector(':scope > .ls-route-connectors');

    if (!svg) {
      svg = document.createElementNS(SVG_NS, 'svg');
      svg.classList.add('ls-route-connectors');
      svg.setAttribute('aria-hidden', 'true');
      svg.setAttribute('focusable', 'false');
      container.insertBefore(svg, container.firstChild);
    }

    const bounds = container.getBoundingClientRect();
    const width = container.clientWidth;
    const height = container.clientHeight;
    svg.setAttribute('viewBox', `0 0 ${width} ${height}`);
    svg.setAttribute('width', String(width));
    svg.setAttribute('height', String(height));
    svg.replaceChildren();

    for (let index = 0; index < items.length - 1; index += 1) {
      const startMarker = items[index].querySelector(markerSelector);
      const endMarker = items[index + 1].querySelector(markerSelector);
      if (!startMarker || !endMarker) continue;

      const startBounds = startMarker.getBoundingClientRect();
      const endBounds = endMarker.getBoundingClientRect();
      const startX = startBounds.left + startBounds.width / 2 - bounds.left;
      const startY = startBounds.top + startBounds.height / 2 - bounds.top;
      const endX = endBounds.left + endBounds.width / 2 - bounds.left;
      const endY = endBounds.top + endBounds.height / 2 - bounds.top;
      const deltaX = endX - startX;
      const deltaY = endY - startY;
      const distance = Math.hypot(deltaX, deltaY);
      if (!distance) continue;

      const startRadius = Math.min(startBounds.width, startBounds.height) / 2;
      const endRadius = Math.min(endBounds.width, endBounds.height) / 2;
      const unitX = deltaX / distance;
      const unitY = deltaY / distance;
      const arc = (index % 2 === 0 ? 1 : -1) * Math.min(distance * 0.14, 30);
      const normalX = -unitY;
      const normalY = unitX;
      const pathData = [
        `M ${startX + unitX * startRadius} ${startY + unitY * startRadius}`,
        `C ${startX + deltaX * 0.32 + normalX * arc} ${startY + deltaY * 0.32 + normalY * arc}`,
        `${startX + deltaX * 0.68 + normalX * arc} ${startY + deltaY * 0.68 + normalY * arc}`,
        `${endX - unitX * endRadius} ${endY - unitY * endRadius}`
      ].join(' ');
      const glow = document.createElementNS(SVG_NS, 'path');
      glow.classList.add('route-trail-glow');
      glow.setAttribute('d', pathData);
      svg.appendChild(glow);

      const line = document.createElementNS(SVG_NS, 'path');
      line.classList.add('route-trail');
      line.setAttribute('d', pathData);
      svg.appendChild(line);
    }
  }

  function renderConnectors() {
    animationFrame = 0;
    if (resizeObserver) resizeObserver.disconnect();

    const containers = [
      ...document.querySelectorAll('.home-dashboard .tree-path')
    ];
    document.querySelectorAll('.path-container .unit-group .lessons-list').forEach((container) => {
      containers.push(container);
    });

    containers.forEach((container) => {
      const isHomePath = container.matches('.tree-path');
      drawContainer(
        container,
        isHomePath ? '.tree-node-item' : '.lesson-node',
        isHomePath ? '.node-bullet' : '.lesson-node-marker'
      );
      if (resizeObserver) resizeObserver.observe(container);
    });
  }

  function scheduleRender() {
    if (animationFrame) cancelAnimationFrame(animationFrame);
    animationFrame = requestAnimationFrame(renderConnectors);
  }

  if ('ResizeObserver' in window) {
    resizeObserver = new ResizeObserver(scheduleRender);
  }

  window.addEventListener('resize', scheduleRender);
  document.fonts?.ready.then(scheduleRender);
  window.renderLessonPathConnectors = scheduleRender;
})();