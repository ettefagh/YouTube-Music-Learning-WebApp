class TeacherAuthStore {
  sessionToken = $state<string | null>(null);
  expiresAt = $state<number>(0);

  get isUnlocked() {
    return this.sessionToken !== null && Date.now() < this.expiresAt;
  }

  unlock() {
    this.sessionToken = crypto.randomUUID();
    this.resetTimer();
  }

  resetTimer() {
    if (this.sessionToken) {
      this.expiresAt = Date.now() + 2 * 60 * 1000; // 2-minute inactivity timer
    }
  }

  lock() {
    this.sessionToken = null;
    this.expiresAt = 0;
  }
}

export const teacherAuth = new TeacherAuthStore();

// Setup global listeners to reset timer
if (typeof window !== 'undefined') {
    const reset = () => teacherAuth.resetTimer();
    window.addEventListener('mousemove', reset);
    window.addEventListener('keydown', reset);
    window.addEventListener('touchstart', reset);

    // Periodically check if timer expired to trigger reactivity if needed
    setInterval(() => {
        if (teacherAuth.sessionToken && Date.now() >= teacherAuth.expiresAt) {
            teacherAuth.lock();
        }
    }, 5000);
}
