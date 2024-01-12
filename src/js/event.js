// 다크모드
const userColorTheme = localStorage.getItem('color-theme');
const osColorTheme = window.matchMedia('(prefers-color-scheme: dark)').matches
    ? 'dark'
    : 'light';
const darkModeButton = document.querySelector('.btn-dark-mode');

const getUserTheme = () => (userColorTheme ? userColorTheme : osColorTheme);

window.addEventListener('load', () => {
    if (getUserTheme() === 'dark') {
        localStorage.setItem('color-theme', 'dark');
        document.documentElement.setAttribute('color-theme', 'dark');
        darkModeButton.classList.add('active');
        darkModeButton.dataset.tooltip = 'Dark mode OFF';
    } else {
        localStorage.setItem('color-theme', 'light');
        document.documentElement.setAttribute('color-theme', 'light');
        darkModeButton.classList.remove('active');
        darkModeButton.dataset.tooltip = 'Dark mode ON';
    }
});

darkModeButton.addEventListener('click', () => {
    if (darkModeButton.classList.contains('active')) {
        localStorage.setItem('color-theme', 'light');
        document.documentElement.setAttribute('color-theme', 'light');
        darkModeButton.classList.remove('active');
        darkModeButton.dataset.tooltip = 'Dark mode ON';
    } else {
        localStorage.setItem('color-theme', 'dark');
        document.documentElement.setAttribute('color-theme', 'dark');
        darkModeButton.classList.add('active');

        darkModeButton.dataset.tooltip = 'Dark mode OFF';
    }
});

// notice 닫기
const notice = document.querySelector('.main-notice');
const noticeCloseButton = document.querySelector('.notice-close');
const noticeValue =
    localStorage.getItem('notice-close') &&
    localStorage.getItem('notice-close');

window.addEventListener('load', () => {
    if (noticeValue === 'true') {
        notice.classList.remove('show');
    } else {
        notice.classList.add('show');
    }
});

noticeCloseButton.addEventListener('click', () => {
    if (notice.classList.contains('show')) {
        localStorage.setItem('notice-close', 'true');
        notice.classList.remove('show');
    } else {
        localStorage.setItem('notice-close', 'false');
        notice.classList.add('show');
    }
});

// 이전 서비스 이동 드롭다운 박스 여닫기
const previousDropdown = document.querySelector('.previous-dropdown');
const previousButton = document.querySelector('.btn-previous');

previousDropdown.addEventListener('click', (e) => {
    if (e.target == previousButton) {
        previousButton.classList.toggle('active');
    }
});

window.addEventListener('click', (e) => {
    if (e.target == previousDropdown || !previousDropdown.contains(e.target)) {
        previousButton.classList.contains('active') &&
            previousButton.classList.remove('active');
    }
});

// tooltip 크기 조절
const resizeTooltip = (target, ratio) => {
    const targetWidth = target.clientWidth;
    const resizedWidth = targetWidth * ratio;

    target.style.width = `${resizedWidth - 24}px`;
};

const resizeIfHidden = (targetTooltip) => {
    const tooltipRect = targetTooltip.getBoundingClientRect();
    const containerRect = document.body.getBoundingClientRect();

    const isPartiallyHiddenOrFullyHidden =
        tooltipRect.right >= containerRect.right;

    if (isPartiallyHiddenOrFullyHidden) {
        const term = tooltipRect.right - containerRect.right;
        const visibleRatio = 1 - term / tooltipRect.width;
        resizeTooltip(targetTooltip, visibleRatio);
    } else {
        targetTooltip.style.width = 'max-content';
    }
};

const resizeObserver = new ResizeObserver(() => {
    const tooltip = document.querySelector('.tooltip');
    if (tooltip) {
        resizeIfHidden(tooltip);
    }
});

const observerCallback = (entries, observer) => {
    entries.forEach((entry) => {
        if (entry.isIntersecting) {
            const intersectionRatio = entry.intersectionRatio;
            if (intersectionRatio < 1) {
                console.log(entry.target);
                resizeTooltip(entry.target, intersectionRatio);
            }
        } else {
            entry.target.style.width = 'max-content';
        }
    });
};

const tooltipIntersectionObserver = new IntersectionObserver(observerCallback, {
    root: null,
    rootMargin: '0px',
    threshold: 0.1,
});

resizeObserver.observe(window.document.body);

// 툴팁 표시
const tooltipTargetElement = document.querySelectorAll('.show-tooltip');

const createTooltip = (textContent) => {
    const tooltipElement = document.createElement('div');
    tooltipElement.setAttribute('class', 'tooltip');
    tooltipElement.innerHTML = textContent;

    return tooltipElement;
};

const addTooltip = (target) => {
    const textContent = target.dataset.tooltip;

    if (textContent) {
        const targetHeight = target.clientHeight;
        const tooltip = createTooltip(textContent);
        tooltip.style.top = `${targetHeight + 10}px`;

        tooltipIntersectionObserver.observe(tooltip);

        target.append(tooltip);
    }
};

const removeTooltip = (target) => {
    const tooltip = target.querySelector('.tooltip');
    tooltip && tooltip.remove();
};

const addTooltipEvent = (target) => {
    target.addEventListener(
        'mouseenter',
        () => {
            addTooltip(target);
        },
        false,
    );

    target.addEventListener(
        'mouseleave',
        () => {
            removeTooltip(target);
        },
        false,
    );

    target.addEventListener('click', () => {
        removeTooltip(target);
    });
};

tooltipTargetElement.forEach((target) => {
    addTooltipEvent(target);
});

// 위니브 사업자 정보 버튼 토글
const infoToggleButton = document.querySelector('.info-toggle-btn');

infoToggleButton.addEventListener('click', () => {
    infoToggleButton.classList.toggle('active');
});
