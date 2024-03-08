const dateFormat = () => {
  // yyyy-mm-dd-hh-mm-ss korean time
  const date = new Date();
  let format = '';
  format += date.getFullYear();
  format += date.getMonth() + 1;
  format += date.getDate();
  return format;
};

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

// 콘텐츠 더보기 드롭다운 박스 여닫기
const contentDropdown = document.querySelector('.content-dropdown');
const contentButton = document.querySelector('.btn-content');

window.addEventListener('click', (e) => {
  if (contentButton.contains(e.target)) {
    contentButton.classList.toggle('active');
  } else if (!contentDropdown.contains(e.target)) {
    contentButton.classList.remove('active');
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

infoToggleButton?.addEventListener('click', () => {
  infoToggleButton.classList.toggle('active');
});
