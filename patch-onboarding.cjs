const fs = require('fs');
const file = 'piano-companion/src/routes/+page.svelte';
let content = fs.readFileSync(file, 'utf8');

const importStatement = `import MascotPip from '$lib/components/MascotPip.svelte';\n  import OnboardingModal from '$lib/components/OnboardingModal.svelte';`;
content = content.replace(`import MascotPip from '$lib/components/MascotPip.svelte';`, importStatement);

const onboardingState = `
  let showOnboarding = $state(false);

  onMount(() => {
    const onboardingComplete = localStorage.getItem('onboardingComplete');
    if (!onboardingComplete) {
      showOnboarding = true;
    }
`;
content = content.replace(/onMount\(\(\) => \{/g, onboardingState);

const finishOnboardingLogic = `
  function handleOnboardingComplete() {
    localStorage.setItem('onboardingComplete', 'true');
    showOnboarding = false;
  }
`;
content = content.replace(`function toggleCompletion() {`, finishOnboardingLogic + `\n  function toggleCompletion() {`);

const onboardingUI = `
  {#if showOnboarding}
    <OnboardingModal onComplete={handleOnboardingComplete} />
  {/if}
`;

content = content.replace(`<div class="cockpit-container">`, `<div class="cockpit-container">\n${onboardingUI}`);

fs.writeFileSync(file, content);
