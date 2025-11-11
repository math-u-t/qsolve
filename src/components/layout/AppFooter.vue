<script setup lang="ts">
const currentYear = new Date().getFullYear()
</script>

<template>
  <footer class="app-footer">
    <div class="container">
      <div class="footer-content">
        <div class="footer-section">
          <h3 class="footer-title">qsolve</h3>
          <p class="footer-desc">校内限定の問題投稿・解答プラットフォーム</p>
        </div>

        <div class="footer-section">
          <h4>リンク</h4>
          <ul class="footer-links">
            <li><router-link to="/">ホーム</router-link></li>
            <li><router-link to="/dashboard">ダッシュボード</router-link></li>
            <li><router-link to="/ranking">ランキング</router-link></li>
            <li><router-link to="/post">問題投稿</router-link></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>サポート</h4>
          <ul class="footer-links">
            <li><a href="#">利用規約</a></li>
            <li><a href="#">プライバシーポリシー</a></li>
            <li><a href="#">お問い合わせ</a></li>
            <li><a href="#">FAQ</a></li>
          </ul>
        </div>

        <div class="footer-section">
          <h4>フォロー</h4>
          <div class="social-links">
            <a href="#" class="social-icon" title="Twitter">
              <span class="material-icons">tag</span>
            </a>
            <a href="#" class="social-icon" title="GitHub">
              <span class="material-icons">code</span>
            </a>
            <a href="#" class="social-icon" title="Email">
              <span class="material-icons">email</span>
            </a>
          </div>
        </div>
      </div>

      <div class="footer-bottom">
        <p>&copy; {{ currentYear }} qsolve. All rights reserved.</p>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.app-footer {
  background-color: var(--bg-secondary);
  border-top: 1px solid var(--border-color);
  padding: var(--spacing-2xl) 0 var(--spacing-lg);
  margin-top: var(--spacing-2xl);
}

.footer-content {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(200px, 1fr));
  gap: var(--spacing-xl);
  margin-bottom: var(--spacing-xl);
}

.footer-section h3,
.footer-section h4 {
  margin-bottom: var(--spacing-md);
  color: var(--text-primary);
  font-size: 1rem;
}

.footer-title {
  font-size: 1.5rem;
  color: var(--color-primary);
}

.footer-desc {
  color: var(--text-secondary);
  font-size: 0.875rem;
  line-height: 1.5;
}

.footer-links {
  list-style: none;
  padding: 0;
  margin: 0;
}

.footer-links li {
  margin-bottom: var(--spacing-sm);
}

.footer-links a {
  color: var(--text-secondary);
  font-size: 0.875rem;
  transition: color var(--transition-fast);
}

.footer-links a:hover {
  color: var(--color-primary);
}

.social-links {
  display: flex;
  gap: var(--spacing-sm);
}

.social-icon {
  display: flex;
  align-items: center;
  justify-content: center;
  width: 40px;
  height: 40px;
  border-radius: var(--radius-md);
  background-color: var(--bg-tertiary);
  color: var(--text-secondary);
  transition: all var(--transition-fast);
}

.social-icon:hover {
  background-color: var(--color-primary);
  color: white;
  transform: translateY(-2px);
}

.footer-bottom {
  padding-top: var(--spacing-lg);
  border-top: 1px solid var(--border-color);
  text-align: center;
}

.footer-bottom p {
  color: var(--text-secondary);
  font-size: 0.875rem;
  margin: 0;
}

@media (max-width: 767px) {
  .footer-content {
    grid-template-columns: 1fr;
    gap: var(--spacing-lg);
  }
}
</style>
