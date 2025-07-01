let player;
let currentVideoIndex = 0;

const videos = [
  {
   title: "Neymar Jr – 100+ WOW Skills",
  src: "https://www.youtube.com/embed/OWOjRdmpM6I?enablejsapi=1",
  thumbnail: "https://img.youtube.com/vi/OWOjRdmpM6I/hqdefault.jpg",
  category: "dribles",
  views: "2,1 mi",
  likes: "123K"
  },
  {
    title: "Cristiano Ronaldo - Dribles e Jogadas",
    src: "https://www.youtube.com/embed/GoACZMFOLi8?enablejsapi=1",
    thumbnail: "https://img.youtube.com/vi/GoACZMFOLi8/0.jpg",
    category: "dribles",
    views: "1,8 mi",
    likes: "110K"
  },
  {
    title: "Lionel Messi - Dribles Incríveis",
    src: "https://www.youtube.com/embed/4U-OStleOKQ?enablejsapi=1",
    thumbnail: "https://img.youtube.com/vi/4U-OStleOKQ/0.jpg",
    category: "dribles",
    views: "2,4 mi",
    likes: "130K"
  },
  {
    title: "Kaká - 100+ Wow Skills",
    src: "https://www.youtube.com/embed/HZcqk-7EtaM?enablejsapi=1",
    thumbnail: "https://img.youtube.com/vi/HZcqk-7EtaM/hqdefault.jpg",
    category: "habilidades",
    views: "900K",
    likes: "75K"
  },
  {
    title: "Vinicius Jr - Habilidades e Gols 2025",
    src: "https://www.youtube.com/embed/msk1oyTF2FU?enablejsapi=1",
    thumbnail: "https://img.youtube.com/vi/msk1oyTF2FU/0.jpg",
    category: "gols",
    views: "1,3 mi",
    likes: "90K"
  },
  {
    title: "Ronaldinho - Most Impossible Dribbles",
    src: "https://www.youtube.com/embed/xwy5JuXstzA?enablejsapi=1",
    thumbnail: "https://img.youtube.com/vi/xwy5JuXstzA/hqdefault.jpg",
    category: "mais",
    views: "3,2 mi",
    likes: "200K"
  }
];

function onYouTubeIframeAPIReady() {
  player = new YT.Player('main-video', {
    events: {
      'onStateChange': onPlayerStateChange
    }
  });
}

function onPlayerStateChange(event) {
  if (event.data === YT.PlayerState.ENDED) {
    playNextVideo();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  const sidebar = document.getElementById('sidebar');
  const titleElement = document.getElementById('video-title');
  const likeCount = document.getElementById('main-video-likes');
  const viewCount = document.getElementById('video-views');
  const videoSection = document.querySelector('.video-section');
  const commentList = document.getElementById('comment-list');
  const commentForm = document.getElementById('comment-form');
  const commentText = document.getElementById('comment-text');
  const commentsCount = document.getElementById('comments-count');
  const commentFilter = document.getElementById('comment-filter');
  const likeBtn = document.getElementById('like-btn');
  const shareBtn = document.getElementById('share-btn');
  const saveBtn = document.getElementById('save-btn');
  const subscribeBtn = document.querySelector('.subscribe-btn');
  const darkModeToggle = document.getElementById('dark-mode-toggle');
  const darkModeText = darkModeToggle.querySelector('.dark-mode-text');
  const categoryButtons = document.querySelectorAll('#sidebar-categories button');

  const comments = [];
  let liked = false;
  let subscribed = false;

  function loadThumbnails(filter = 'todos') {
    sidebar.querySelectorAll('.thumbnail').forEach(e => e.remove());
    let filtered = filter === 'todos' ? videos : videos.filter(v => v.category === filter);

    filtered.forEach(video => {
      const index = videos.indexOf(video);
      const thumbDiv = document.createElement('div');
      thumbDiv.className = 'thumbnail';
      thumbDiv.dataset.index = index;
      thumbDiv.innerHTML = `
        <img src="${video.thumbnail}" alt="${video.title}" />
        <div>
          <div class="title">${video.title}</div>
          <div class="stats">👁️ ${video.views} • 👍 ${video.likes}</div>
        </div>
      `;
      thumbDiv.onclick = () => changeVideo(index);
      sidebar.appendChild(thumbDiv);
    });
  }

  function changeVideo(index) {
    if (index === currentVideoIndex) return;

    videoSection.classList.add('fade-out');
    setTimeout(() => {
      currentVideoIndex = index;
      const video = videos[index];
      titleElement.textContent = video.title;
      likeCount.textContent = video.likes;
      viewCount.textContent = `${video.views} visualizações • há 3 anos`;

      if (player && typeof player.loadVideoById === 'function') {
        player.loadVideoById(video.src.split('/embed/')[1].split('?')[0]);
      } else {
        document.getElementById('main-video').src = video.src;
      }

      resetButtons();
      videoSection.classList.remove('fade-out');
    }, 400);
  }

  function playNextVideo() {
    let nextIndex = (currentVideoIndex + 1) % videos.length;
    changeVideo(nextIndex);
  }

  function renderComments() {
    let filtered = [...comments];
    if (commentFilter.value === 'recentes') {
      filtered.sort((a, b) => b.date - a.date);
    } else {
      filtered.sort((a, b) => b.text.length - a.text.length);
    }
    commentList.innerHTML = filtered.map(c => `<div class="comment"><strong>${c.name}</strong>${c.text}</div>`).join('');
    commentsCount.textContent = `(${comments.length})`;
  }

  commentForm.addEventListener('submit', e => {
    e.preventDefault();
    const text = commentText.value.trim();
    if (text) {
      comments.push({ name: 'Usuário', text, date: new Date() });
      commentText.value = '';
      renderComments();
    }
  });

  commentFilter.addEventListener('change', renderComments);

  likeBtn.addEventListener('click', () => {
    liked = !liked;
    likeBtn.style.backgroundColor = liked ? '#ff0000' : '#eee';
    likeBtn.style.color = liked ? 'white' : '#333';
    likeBtn.textContent = liked ? '👍 Curtido' : '👍 Curtir';
  });

  shareBtn.addEventListener('click', () => {
    const videoUrl = videos[currentVideoIndex].src.split('?')[0];
    navigator.clipboard.writeText(videoUrl).then(() => alert('Link copiado!'));
  });

  saveBtn.addEventListener('click', () => alert('Vídeo salvo!'));

  subscribeBtn.addEventListener('click', () => {
    subscribed = !subscribed;
    subscribeBtn.textContent = subscribed ? 'Inscrito' : 'Inscreva-se';
    subscribeBtn.style.backgroundColor = subscribed ? '#888' : '#cc0000';
    subscribeBtn.style.color = '#fff';
  });

  function resetButtons() {
    liked = false;
    likeBtn.style.backgroundColor = '#eee';
    likeBtn.style.color = '#333';
    likeBtn.textContent = '👍 Curtir';

    subscribed = false;
    subscribeBtn.textContent = 'Inscreva-se';
    subscribeBtn.style.backgroundColor = '#cc0000';
    subscribeBtn.style.color = '#fff';
  }

  darkModeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDark = document.body.classList.contains('dark-mode');
    darkModeToggle.innerHTML = isDark
      ? '<span class="dark-mode-text">Modo claro</span> ☀️'
      : '<span class="dark-mode-text">Modo escuro</span> 🌙';
  });

  categoryButtons.forEach(btn => {
    btn.addEventListener('click', () => {
      categoryButtons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      loadThumbnails(btn.dataset.category);
    });
  });

  loadThumbnails();
  renderComments();
  window.login = () => alert("Função de login não implementada.");
  window.goHome = () => alert("Função ir para Home não implementada.");
});