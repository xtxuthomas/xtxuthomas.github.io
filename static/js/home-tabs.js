const menu = document.querySelector('.home-tabs-menu');
const tabs = [...menu.querySelectorAll('[data-home-tab]')];
const panels = tabs.map(tab => document.getElementById(tab.hash.slice(1)));
const illustrationPanel = document.getElementById('binary-evolution-illustration');
const illustrationSubtabs = document.getElementById('illustration-subtabs');
const illustrationLinks = [...menu.querySelectorAll('[data-illustration-link]')];
const illustrationTab = tabs.find(tab => tab.hash === '#binary-evolution-illustration');

function showTab(index) {
    tabs.forEach((tab, i) => {
        const active = i === index;
        tab.setAttribute('aria-selected', active);
        tab.tabIndex = active ? 0 : -1;
        panels[i].hidden = !active;
    });
    const illustrationsActive = panels[index] === illustrationPanel;
    illustrationSubtabs.hidden = !illustrationsActive;
    illustrationTab.setAttribute('aria-expanded', illustrationsActive);
    illustrationLinks.forEach(link => {
        if (illustrationsActive && link.hash === location.hash) link.setAttribute('aria-current', 'location');
        else link.removeAttribute('aria-current');
    });
}

function syncWithLocation() {
    const illustrationLink = illustrationLinks.find(link => link.hash === location.hash);
    if (illustrationLink) {
        showTab(tabs.indexOf(illustrationTab));
        document.getElementById(illustrationLink.hash.slice(1)).scrollIntoView();
        return;
    }
    const index = tabs.findIndex(tab => tab.hash === location.hash);
    if (index >= 0 || !location.hash) showTab(Math.max(index, 0));
}

function activateTab(index) {
    const hash = tabs[index].hash;
    if (location.hash !== hash) history.pushState(null, '', hash);
    showTab(index);
}

if (tabs.length && panels.every(Boolean)) {
    illustrationTab.setAttribute('aria-controls', illustrationPanel.id + ' ' + illustrationSubtabs.id);
    illustrationLinks.forEach(link => {
        link.addEventListener('click', event => {
            if (event.ctrlKey || event.metaKey || event.shiftKey || event.altKey) return;
            event.preventDefault();
            if (location.hash !== link.hash) history.pushState(null, '', link.hash);
            showTab(tabs.indexOf(illustrationTab));
            document.getElementById(link.hash.slice(1)).scrollIntoView({
                behavior: window.matchMedia('(prefers-reduced-motion: reduce)').matches ? 'auto' : 'smooth',
                block: 'start'
            });
        });
    });
    menu.setAttribute('role', 'tablist');
    menu.setAttribute('aria-orientation', 'vertical');
    tabs.forEach((tab, index) => {
        const panel = panels[index];
        tab.id = 'tab-' + panel.id;
        tab.setAttribute('role', 'tab');
        if (tab !== illustrationTab) tab.setAttribute('aria-controls', panel.id);
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
