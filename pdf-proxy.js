// /source/pdf-proxy.js
const getRawUrl = (url) => {
  const proxyUrl = new URL(url, window.location.href);
  const fileUrl = proxyUrl.searchParams.get('url');
  if (!fileUrl) throw new Error('Missing ?url=');
  return fileUrl;
};

const init = async () => {
  const params = new URLSearchParams(window.location.search);
  let url = params.get('url');
  const container = document.getElementById('container');

  if (!url) {
    container.innerText = '请提供 ?url= 参数';
    return;
  }

  // 强制将 GitHub.com 的链接转换为 raw 链接
  if (url.includes('github.com') && !url.includes('raw.githubusercontent.com')) {
    url = url.replace('github.com', 'raw.githubusercontent.com').replace('/blob/', '/');
  }

  try {
    const response = await fetch(url);
    if (!response.ok) throw new Error(`HTTP ${response.status}`);
    const blob = await response.blob();
    const objectUrl = URL.createObjectURL(blob);
    const iframe = document.createElement('iframe');
    iframe.src = `/pdfjs/web/viewer.html?file=${encodeURIComponent(objectUrl)}`;
    iframe.style.width = '100%';
    iframe.style.height = '100%';
    iframe.style.border = 'none';
    container.appendChild(iframe);
  } catch (error) {
    container.innerText = `❌ 加载失败: ${error.message}`;
  }
};

init();