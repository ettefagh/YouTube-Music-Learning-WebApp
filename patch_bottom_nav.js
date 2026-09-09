const fs = require('fs');

const file = 'piano-companion/src/lib/components/kids/KidsBottomNav.svelte';
let content = fs.readFileSync(file, 'utf8');

const targetScript = `
  let isVisible = $derived(['library', 'player', 'studio'].includes(activeScreen));
</script>
`;

const replaceScript = `
  let isVisible = $derived(['library', 'player', 'studio'].includes(activeScreen));

  let lastScrollY = $state(0);
  let isNavHidden = $state(false);

  function handleScroll() {
    if (typeof window === 'undefined') return;
    const currentScrollY = window.scrollY;

    // Auto-hide bottom nav bar:
    // Hide when scrolling down, show when scrolling up or near the top
    if (currentScrollY > lastScrollY && currentScrollY > 50) {
      isNavHidden = true;
    } else {
      isNavHidden = false;
    }

    lastScrollY = currentScrollY;
  }
</script>

<svelte:window onscroll={handleScroll} />
`;

content = content.replace(targetScript.trim(), replaceScript.trim());


const targetNav = `<nav class="kids-bottom-dock">`;
const replaceNav = `<nav class="kids-bottom-dock {isNavHidden ? 'nav-hidden' : ''}">`;

content = content.replace(targetNav, replaceNav);

const targetCSS = `
  .kids-bottom-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: #ffffff;
    border-top: 3.5px solid #000000;
    box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    z-index: 1000;
  }
`;

const replaceCSS = `
  .kids-bottom-dock {
    position: fixed;
    bottom: 0;
    left: 0;
    right: 0;
    height: 72px;
    background: #ffffff;
    border-top: 3.5px solid #000000;
    box-shadow: 0 -4px 0 rgba(0, 0, 0, 0.12);
    display: flex;
    justify-content: center;
    align-items: center;
    padding: 0 16px;
    z-index: 1000;
    transition: transform 0.3s ease-in-out;
  }

  .kids-bottom-dock.nav-hidden {
    transform: translateY(100%);
  }
`;

content = content.replace(targetCSS.trim(), replaceCSS.trim());

fs.writeFileSync(file, content);
console.log('KidsBottomNav patched');
