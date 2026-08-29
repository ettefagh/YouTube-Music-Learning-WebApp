class TeacherAuthStore {
  sessionToken = $state<string | null>(null);
  expiresAt = $state<number>(0);

  get isUnlocked() {
    return this.sessionToken !== null && Date.now() < this.expiresAt;
  }

  unlock() {
    this.sessionToken = crypto.randomUUID();
    this.expiresAt = Date.now() + 15 * 60 * 1000; // 15-minute validity
  }

  lock() {
    this.sessionToken = null;
    this.expiresAt = 0;
  }
}

export const teacherAuth = new TeacherAuthStore();
