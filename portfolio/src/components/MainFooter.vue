<template>
  <footer class="footer">
    <div class="footer-container">
      <div class="footer-info">
        <p><strong>Kareem Al-Khalily</strong></p>
        <p><strong>Email:</strong> <a href="mailto:stuff@alkhalily.net">stuff@alkhalily.net</a></p>
        <p><strong>Occupation:</strong> <span>Studying at FH Hagenberg (start: 01.10.2025)</span></p>
        <p><span>Vienna, Austria</span></p>
      </div>

      <div class="footer-social">
        <a href="https://www.artstation.com/kareem_al-khalily" class="social-link" target="_blank">
          <img src="@/assets/images/socials/Artstation_Logo.png" alt="Artstation" class="artstation-icon" />
        </a>
        <a href="https://www.youtube.com/@kareemal-khalily5208" class="social-link" target="_blank">
          <img src="@/assets/images/socials/Youtube_Logo.png" alt="Youtube" class="youtube-icon" />
        </a>
        <a href="https://www.instagram.com/kareemalkhalily/" class="social-link" target="_blank">
          <img src="@/assets/images/socials/Instagram_Logo.png" alt="Instagram" class="instagram-icon" />
        </a>
      </div>
    </div>
  </footer>
</template>

<style scoped>
.footer {
  background-color: var(--footer-bg);
  color: #fff;
  padding: 30px;
  text-align: left;
}

.footer-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
}

.footer-info p {
  margin: 5px 0;
  font-size: 14px;
}

.footer-info a {
  color: var(--primary-accent);
  text-decoration: none;
}

.footer-info a:hover {
  text-decoration: underline;
}

.footer-social {
  display: flex;
  justify-content: center;
  gap: 15px;
}

.social-icon {
  width: 43px;
  height: 30px;
  transition: transform 0.3s ease;
  object-fit: contain;
}

.social-link:hover .social-icon {
  transform: scale(1.2);
}
</style>
