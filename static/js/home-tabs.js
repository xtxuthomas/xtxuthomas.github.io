const menu = document.querySelector('.home-tabs-menu');
const tabs = [...menu.querySelectorAll('[data-home-tab]')];
const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));

function showTab(index) {
    tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', active);
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
    });
}

function syncWithLocation() {
    const index = tabs.findIndex(tab => tab.hash === location.hash);
    if (index >= 0 || !location.hash) showTab(Math.max(index, 0));
}

function activateTab(index) {
    showTab(index);
    const hash = tabs[index].hash;
    if (location.hash !== hash) history.pushState(null, '', hash);
}

if (tabs.length && panels.every(Boolean)) {
    menu.setAttribute('role', 'tablist');
    menu.setAttribute('aria-orientation', 'vertical');
    tabs.forEach((tab, index) => {
        const panel = panels[index];
        tab.id = 'tab-' + panel.id;
        tab.setAttribute('role', 'tab');
        tab.setAttribute('aria-controls', panel.id);
        panel.setAttribute('role', 'tabpanel');
        panel.setAttribute('aria-labelledby', tab.id);
        panel.tabIndex = 0;
        tab.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            activateTab(index);
        });
        tab.addEventListener('keydown', event => {
            let next;
            switch (event.key) {
                case 'ArrowUp':
                case 'ArrowLeft': next = (index - 1 + tabs.length) % tabs.length; break;
                case 'ArrowDown':
                case 'ArrowRight': next = (index + 1) % tabs.length; break;
                case 'Home': next = 0; break;
                case 'End': next = tabs.length - 1; break;
                case ' ': next = index; break;
                default: return;
            }
            event.preventDefault();
            activateTab(next);
            tabs[next].focus();
        });
    });
    showTab(0);
    syncWithLocation();
    window.addEventListener('hashchange', syncWithLocation);
}
