document.addEventListener("DOMContentLoaded", () => {
  if (window.lucide && typeof window.lucide.createIcons === "function") {
    window.lucide.createIcons();
  }

  const header = document.getElementById("site-header");
  const pageOffset = document.getElementById("page-offset");
  const mobileMenu = document.getElementById("mobile-menu");
  const searchOverlay = document.getElementById("search-overlay");
  const mobileMenuButtons = Array.from(document.querySelectorAll("[data-mobile-menu-toggle]"));
  const searchButtons = Array.from(document.querySelectorAll("[data-search-toggle]"));

  const syncHeaderOffset = () => {
    if (!header || !pageOffset) return;
    pageOffset.style.height = `${Math.ceil(header.getBoundingClientRect().height)}px`;
  };

  const handleScroll = () => {
    if (!header) return;
    header.classList.toggle("header-scrolled", window.scrollY > 10);
  };

  syncHeaderOffset();
  handleScroll();
  window.addEventListener("resize", syncHeaderOffset);
  window.addEventListener("scroll", handleScroll);

  const setMobileMenuState = (isOpen) => {
    if (!mobileMenu) return;
    mobileMenu.classList.toggle("hidden", !isOpen);
    document.body.classList.toggle("menu-open", isOpen);

    mobileMenuButtons.forEach((button) => {
      button.querySelector(".mobile-menu-open-icon")?.classList.toggle("hidden", isOpen);
      button.querySelector(".mobile-menu-close-icon")?.classList.toggle("hidden", !isOpen);
    });
  };

  mobileMenuButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setMobileMenuState(mobileMenu?.classList.contains("hidden"));
    });
  });

  document.querySelectorAll("[data-mobile-link]").forEach((link) => {
    link.addEventListener("click", () => setMobileMenuState(false));
  });

  document.querySelectorAll("[data-mobile-submenu-toggle]").forEach((button) => {
    button.addEventListener("click", () => {
      const targetId = button.getAttribute("data-mobile-submenu-toggle");
      if (!targetId) return;

      const panel = document.getElementById(targetId);
      const icon = button.querySelector("svg");
      if (!panel) return;

      const willOpen = panel.classList.contains("hidden");

      document.querySelectorAll("[data-mobile-submenu-toggle]").forEach((node) => {
        const nodeTargetId = node.getAttribute("data-mobile-submenu-toggle");
        const nodePanel = nodeTargetId ? document.getElementById(nodeTargetId) : null;
        nodePanel?.classList.add("hidden");
        node.querySelector("svg")?.classList.remove("rotate-180");
      });

      panel.classList.toggle("hidden", !willOpen);
      icon?.classList.toggle("rotate-180", willOpen);
    });
  });

  const setSearchState = (isOpen) => {
    if (!searchOverlay) return;
    searchOverlay.classList.toggle("hidden", !isOpen);
    if (isOpen) {
      searchOverlay.querySelector("[data-search-input]")?.focus();
    }
  };

  searchButtons.forEach((button) => {
    button.addEventListener("click", () => {
      setSearchState(searchOverlay?.classList.contains("hidden"));
    });
  });

  document.addEventListener("click", (event) => {
    if (
      searchOverlay &&
      !searchOverlay.classList.contains("hidden") &&
      !searchOverlay.contains(event.target) &&
      !searchButtons.some((button) => button.contains(event.target))
    ) {
      setSearchState(false);
    }
  });

  document.querySelectorAll("[data-modal-open]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const targetId = trigger.getAttribute("data-modal-open");
      if (!targetId) return;
      const modal = document.getElementById(targetId);
      if (!modal) return;
      modal.classList.remove("hidden");
      modal.setAttribute("aria-hidden", "false");
      document.body.style.overflow = "hidden";
    });
  });

  const closeModal = (modal) => {
    modal.classList.add("hidden");
    modal.setAttribute("aria-hidden", "true");
    document.body.style.overflow = "";
  };

  document.querySelectorAll(".modal").forEach((modal) => {
    modal.setAttribute("aria-hidden", "true");

    modal.querySelectorAll("[data-modal-close]").forEach((button) => {
      button.addEventListener("click", () => closeModal(modal));
    });

    modal.addEventListener("click", (event) => {
      if (event.target === modal) closeModal(modal);
    });
  });

  document.addEventListener("keydown", (event) => {
    if (event.key !== "Escape") return;
    setSearchState(false);
    setMobileMenuState(false);
    document.querySelectorAll(".modal").forEach((modal) => {
      if (!modal.classList.contains("hidden")) {
        closeModal(modal);
      }
    });
  });

  const tabButtons = Array.from(document.querySelectorAll("[data-tab-target]"));
  const tabPanels = Array.from(document.querySelectorAll("[data-tab-panel]"));

  if (tabButtons.length > 0 && tabPanels.length > 0) {
    const setActiveTab = (target) => {
      tabButtons.forEach((button) => {
        const isActive = button.getAttribute("data-tab-target") === target;
        button.classList.toggle("border-sky-600", isActive);
        button.classList.toggle("text-sky-600", isActive);
        button.classList.toggle("border-transparent", !isActive);
        button.classList.toggle("text-slate-500", !isActive);
      });

      tabPanels.forEach((panel) => {
        panel.classList.toggle("hidden", panel.getAttribute("data-tab-panel") !== target);
      });
    };

    tabButtons.forEach((button) => {
      button.addEventListener("click", () => {
        const target = button.getAttribute("data-tab-target");
        if (target) setActiveTab(target);
      });
    });

    setActiveTab(tabButtons[0].getAttribute("data-tab-target"));
  }

  document.querySelectorAll("[data-faq-trigger]").forEach((trigger) => {
    trigger.addEventListener("click", () => {
      const item = trigger.closest(".faq-item");
      if (!item) return;
      const panel = item.querySelector(".faq-panel");
      const symbol = item.querySelector(".faq-symbol");
      const title = trigger.querySelector("span");
      const isOpen = panel && !panel.classList.contains("hidden");

      document.querySelectorAll(".faq-item").forEach((node) => {
        node.querySelector(".faq-panel")?.classList.add("hidden");
        const nodeSymbol = node.querySelector(".faq-symbol");
        if (nodeSymbol) nodeSymbol.textContent = "+";
        const nodeTitle = node.querySelector("[data-faq-trigger] span");
        nodeTitle?.classList.remove("text-sky-600");
        nodeTitle?.classList.add("text-slate-900");
      });

      if (panel && !isOpen) {
        panel.classList.remove("hidden");
        if (symbol) symbol.textContent = "-";
        title?.classList.add("text-sky-600");
        title?.classList.remove("text-slate-900");
      }
    });
  });

  setTimeout(() => {
    document.querySelectorAll(".flash-message").forEach((message) => {
      message.remove();
    });
  }, 4500);

  const marketSearchForm = document.querySelector("[data-market-search-form]");
  const marketSearchInput = document.querySelector("[data-market-search-input]");
  const marketFilterForm = document.querySelector("[data-market-filter-form]");
  let searchTimer;

  if (marketSearchForm && marketSearchInput) {
    marketSearchInput.addEventListener("input", () => {
      window.clearTimeout(searchTimer);
      searchTimer = window.setTimeout(() => {
        marketSearchForm.requestSubmit();
      }, 250);
    });
  }

  if (marketFilterForm) {
    marketFilterForm.querySelectorAll("[data-exclusive-group]").forEach((input) => {
      input.addEventListener("change", () => {
        const groupName = input.getAttribute("data-exclusive-group");
        const isChecked = input.checked;

        marketFilterForm.querySelectorAll(`[data-exclusive-group="${groupName}"]`).forEach((peer) => {
          if (peer !== input) {
            peer.checked = false;
          }
        });

        input.checked = isChecked;
        marketFilterForm.requestSubmit();
      });
    });
  }
});
