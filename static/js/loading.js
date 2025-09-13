const loading = document.getElementById("loadingContainer");

// Disable scrolls, this was AI as I couldnt figure it out so not much I can say about this!
let _scrollY = 0;
let _supportsPassive = false;

try {
  window.addEventListener(
    "test",
    null,
    Object.defineProperty({}, "passive", {
      get: function () {
        _supportsPassive = true;
      },
    })
  );
} catch (e) {}

const _wheelOpt = _supportsPassive ? { passive: false } : false;

function preventDefault(e) {
  e.preventDefault();
}

function preventKeyScroll(e) {
  const keys = [32, 33, 34, 35, 36, 37, 38, 39, 40];
  if (keys.includes(e.keyCode)) {
    e.preventDefault();
  }
}

function lockScroll() {
  _scrollY = window.scrollY || document.documentElement.scrollTop || 0;

  document.documentElement.style.overflow = "hidden";
  document.body.style.position = "fixed";
  document.body.style.top = `-${_scrollY}px`;
  document.body.style.left = "0";
  document.body.style.right = "0";
  document.body.style.width = "100%";

  document.addEventListener("wheel", preventDefault, _wheelOpt);
  document.addEventListener("touchmove", preventDefault, _wheelOpt);
  document.addEventListener("keydown", preventKeyScroll, false);
}

function unlockScroll() {
  document.removeEventListener("wheel", preventDefault, _wheelOpt);
  document.removeEventListener("touchmove", preventDefault, _wheelOpt);
  document.removeEventListener("keydown", preventKeyScroll, false);

  document.body.style.position = "";
  document.body.style.top = "";
  document.body.style.left = "";
  document.body.style.right = "";
  document.body.style.width = "";
  document.documentElement.style.overflow = "";

  window.scrollTo(0, _scrollY);
}

function showLoading() {
  if (localStorage.getItem("loading")) return;

  loading.classList.remove("hidden");
  lockScroll();

  setTimeout(() => {
    loading.classList.add("zoom-phase");
  }, 1200);

  setTimeout(() => {
    loading.classList.add("lines-phase");
  }, 2300);

  setTimeout(() => {
    loading.classList.add("hidden");
    unlockScroll();
  }, 4200);
}

showLoading();
