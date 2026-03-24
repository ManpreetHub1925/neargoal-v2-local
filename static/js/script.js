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
    const isScrolled = window.scrollY > 10;
    const wasScrolled = header.classList.contains("header-scrolled");
    
    if (isScrolled !== wasScrolled) {
      header.classList.toggle("header-scrolled", isScrolled);
      // Wait for the transition to finish or just sync immediately
      // Since it's a 300ms transition, we might want to sync after a bit or use requestAnimationFrame
      syncHeaderOffset();
      
      // Also sync after transition
      setTimeout(syncHeaderOffset, 310);
    }
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


  // Autocomplete Search
  let autocompleteTimer;
  let currentResults = [];

  function closeAutocomplete(input) {
    const dropdown = input.nextElementSibling?.classList.contains('autocomplete-dropdown') ? input.nextElementSibling : input.parentNode.querySelector('.autocomplete-dropdown');
    if (dropdown) dropdown.classList.add('hidden');
  }

  function renderAutocomplete(input, results) {
    const dropdown = input.nextElementSibling?.classList.contains('autocomplete-dropdown') ? input.nextElementSibling : input.parentNode.querySelector('.autocomplete-dropdown');
    if (!dropdown) return;

    if (results.length === 0) {
      dropdown.innerHTML = '<div class="p-3 text-slate-500 text-sm">No results found</div>';
      dropdown.classList.remove('hidden');
      return;
    }

    dropdown.innerHTML = results.map(r => 
      `<a href="${r.url}" class="block p-3 hover:bg-sky-50 border-b border-slate-100 last:border-b-0 text-sm transition-colors group">
        <div class="font-medium text-slate-900 group-hover:text-sky-600 line-clamp-1">${r.title}</div>
        <div class="text-xs text-slate-500 mt-1 flex items-center gap-2">
          <span class="px-2 py-0.5 bg-sky-100 text-sky-800 rounded-full text-xs font-medium">${r.type}</span>
          ${r.badge ? `<span class="text-slate-400">${r.badge}</span>` : ''}
        </div>
        <div class="text-xs text-slate-400 mt-1 line-clamp-1">${r.snippet}</div>
      </a>`
    ).join('');

    dropdown.classList.remove('hidden');
    dropdown.scrollTop = 0;
  }

  function initAutocomplete(input) {
    const mode = input.dataset.autocomplete || 'full';
    input.addEventListener('input', () => {
      const q = input.value.trim();
      closeAutocomplete(input);

      if (q.length < 2) return;

      window.clearTimeout(autocompleteTimer);
      autocompleteTimer = window.setTimeout(async () => {
        try {
          const res = await fetch(`/api/search?q=${encodeURIComponent(q)}`);
          currentResults = await res.json();
          renderAutocomplete(input, currentResults);
        } catch (err) {
          console.error('Search error:', err);
        }
      }, 300);
    });

    input.addEventListener('focus', () => {
      if (input.value.length >= 2 && currentResults.length > 0) {
        renderAutocomplete(input, currentResults);
      }
    });

    ['blur', 'keydown'].forEach(ev => {
      input.addEventListener(ev, (e) => {
        if (e.type === 'keydown' && e.key === 'Escape') {
          closeAutocomplete(input);
          input.blur();
        }
        if (e.type === 'blur') {
          setTimeout(() => closeAutocomplete(input), 200);
        }
      });
    });
  }

// Init on all autocomplete inputs
  document.querySelectorAll('[data-autocomplete]').forEach(initAutocomplete);

// Forms Validation & Country Codes
const countryCodes = {
  'Afghanistan': '+93',
  'Albania': '+355',
  'Algeria': '+213',
  'American Samoa': '+1-684',
  'Andorra': '+376',
  'Angola': '+244',
  'Anguilla': '+1-264',
  'Antarctica': '+672',
  'Antigua and Barbuda': '+1-268',
  'Argentina': '+54',
  'Armenia': '+374',
  'Aruba': '+297',
  'Australia': '+61',
  'Austria': '+43',
  'Azerbaijan': '+994',
  'Bahamas': '+1-242',
  'Bahrain': '+973',
  'Bangladesh': '+880',
  'Barbados': '+1-246',
  'Belarus': '+375',
  'Belgium': '+32',
  'Belize': '+501',
  'Benin': '+229',
  'Bermuda': '+1-441',
  'Bhutan': '+975',
  'Bolivia': '+591',
  'Bosnia and Herzegovina': '+387',
  'Botswana': '+267',
  'Brazil': '+55',
  'British Indian Ocean Territory': '+246',
  'British Virgin Islands': '+1-284',
  'Brunei': '+673',
  'Bulgaria': '+359',
  'Burkina Faso': '+226',
  'Burundi': '+257',
  'Cambodia': '+855',
  'Cameroon': '+237',
  'Canada': '+1',
  'Cape Verde': '+238',
  'Cayman Islands': '+1-345',
  'Central African Republic': '+236',
  'Chad': '+235',
  'Chile': '+56',
  'China': '+86',
  'Christmas Island': '+61',
  'Cocos Islands': '+61',
  'Colombia': '+57',
  'Comoros': '+269',
  'Cook Islands': '+682',
  'Costa Rica': '+506',
  "Côte d'Ivoire": '+225',
  'Croatia': '+385',
  'Cuba': '+53',
  'Curaçao': '+599',
  'Cyprus': '+357',
  'Czech Republic': '+420',
  'Democratic Republic of the Congo': '+243',
  'Denmark': '+45',
  'Djibouti': '+253',
  'Dominica': '+1-767',
  'Dominican Republic': '+1-809, +1-829, +1-849',
  'East Timor': '+670',
  'Ecuador': '+593',
  'Egypt': '+20',
  'El Salvador': '+503',
  'Equatorial Guinea': '+240',
  'Eritrea': '+291',
  'Estonia': '+372',
  'Eswatini': '+268',
  'Ethiopia': '+251',
  'Falkland Islands': '+500',
  'Faroe Islands': '+298',
  'Fiji': '+679',
  'Finland': '+358',
  'France': '+33',
  'French Polynesia': '+689',
  'Gabon': '+241',
  'Gambia': '+220',
  'Georgia': '+995',
  'Germany': '+49',
  'Ghana': '+233',
  'Gibraltar': '+350',
  'Greece': '+30',
  'Greenland': '+299',
  'Grenada': '+1-473',
  'Guam': '+1-671',
  'Guatemala': '+502',
  'Guernsey': '+44',
  'Guinea': '+224',
  'Guinea-Bissau': '+245',
  'Guyana': '+592',
  'Haiti': '+509',
  'Honduras': '+504',
  'Hong Kong SAR China': '+852',
  'Hungary': '+36',
  'Iceland': '+354',
  'India': '+91',
  'Indonesia': '+62',
  'Iran': '+98',
  'Iraq': '+964',
  'Ireland': '+353',
  'Isle of Man': '+44',
  'Israel': '+972',
  'Italy': '+39',
  'Jamaica': '+1-876',
  'Japan': '+81',
  'Jersey': '+44',
  'Jordan': '+962',
  'Kazakhstan': '+7',
  'Kenya': '+254',
  'Kiribati': '+686',
  'Kosovo': '+383',
  'Kuwait': '+965',
  'Kyrgyzstan': '+996',
  'Laos': '+856',
  'Latvia': '+371',
  'Lebanon': '+961',
  'Lesotho': '+266',
  'Liberia': '+231',
  'Libya': '+218',
  'Liechtenstein': '+423',
  'Lithuania': '+370',
  'Luxembourg': '+352',
  'Macau SAR China': '+853',
  'Madagascar': '+261',
  'Malawi': '+265',
  'Malaysia': '+60',
  'Maldives': '+960',
  'Mali': '+223',
  'Malta': '+356',
  'Marshall Islands': '+692',
  'Mauritania': '+222',
  'Mauritius': '+230',
  'Mayotte': '+262',
  'Mexico': '+52',
  'Micronesia': '+691',
  'Moldova': '+373',
  'Monaco': '+377',
  'Mongolia': '+976',
  'Montenegro': '+382',
  'Montserrat': '+1-664',
  'Morocco': '+212',
  'Mozambique': '+258',
  'Myanmar': '+95',
  'Namibia': '+264',
  'Nauru': '+674',
  'Nepal': '+977',
  'Netherlands': '+31',
  'New Caledonia': '+687',
  'New Zealand': '+64',
  'Nicaragua': '+505',
  'Niger': '+227',
  'Nigeria': '+234',
  'Niue': '+683',
  'Norfolk Island': '+672',
  'North Korea': '+850',
  'North Macedonia': '+389',
  'Northern Mariana Islands': '+1-670',
  'Norway': '+47',
  'Oman': '+968',
  'Pakistan': '+92',
  'Palau': '+680',
  'Palestine': '+970',
  'Panama': '+507',
  'Papua New Guinea': '+675',
  'Paraguay': '+595',
  'Peru': '+51',
  'Philippines': '+63',
  'Pitcairn Islands': '+64',
  'Poland': '+48',
  'Portugal': '+351',
  'Puerto Rico': '+1-787, +1-939',
  'Qatar': '+974',
  'Romania': '+40',
  'Russia': '+7',
  'Rwanda': '+250',
  'Réunion': '+262',
  'Saint Barthélemy': '+590',
  'Saint Helena': '+290',
  'Saint Kitts and Nevis': '+1-869',
  'Saint Lucia': '+1-758',
  'Saint Martin': '+590',
  'Saint Pierre and Miquelon': '+508',
  'Saint Vincent and the Grenadines': '+1-784',
  'Samoa': '+685',
  'San Marino': '+378',
  'São Tomé and Príncipe': '+239',
  'Saudi Arabia': '+966',
  'Senegal': '+221',
  'Serbia': '+381',
  'Seychelles': '+248',
  'Sierra Leone': '+232',
  'Singapore': '+65',
  'Sint Maarten': '+1-721',
  'Slovakia': '+421',
  'Slovenia': '+386',
  'Solomon Islands': '+685',
  'Somalia': '+252',
  'South Africa': '+27',
  'South Korea': '+82',
  'South Sudan': '+211',
  'Spain': '+34',
  'Sri Lanka': '+94',
  'Sudan': '+249',
  'Suriname': '+597',
  'Sweden': '+46',
  'Switzerland': '+41',
  'Syria': '+963',
  'Taiwan': '+886',
  'Tajikistan': '+992',
  'Tanzania': '+255',
  'Thailand': '+66',
  'Togo': '+228',
  'Tokelau': '+690',
  'Tonga': '+676',
  'Trinidad and Tobago': '+1-868',
  'Tunisia': '+216',
  'Turkey': '+90',
  'Turkmenistan': '+993',
  'Turks and Caicos Islands': '+1-649',
  'Tuvalu': '+688',
  'U.S. Virgin Islands': '+1-340',
  'Uganda': '+256',
  'Ukraine': '+380',
  'United Arab Emirates': '+971',
  'United Kingdom': '+44',
  'United States': '+1',
  'Uruguay': '+598',
  'Uzbekistan': '+998',
  'Vanuatu': '+678',
  'Vatican City': '+39',
  'Venezuela': '+58',
  'Vietnam': '+84',
  'Wallis and Futuna': '+681',
  'Yemen': '+967',
  'Zambia': '+260',
  'Zimbabwe': '+263',
  'Other': '+1'
};

const countries = Object.keys(countryCodes).sort();

function initCountryPhone(countrySelect, codeInput, phoneInput) {
  countrySelect.innerHTML = '<option value="">Select Country*</option>' + 
    countries.map(c => `<option value="${c}">${c}</option>`).join('');
  
  countrySelect.addEventListener('change', () => {
    const code = countryCodes[countrySelect.value] || '+1';
    codeInput.value = code;
    phoneInput.focus();
  });

  // Fix phone input widths
  const phoneContainers = document.querySelectorAll('.flex.gap-2:has(input[name="country_code"])');
  phoneContainers.forEach(container => {
    const codeInput = container.querySelector('input[name="country_code"]');
    const phoneInput = container.querySelector('input[name="phone"]');
    if (codeInput && phoneInput) {
      codeInput.style.width = '80px';
      codeInput.style.flexShrink = '0';
      phoneInput.style.flexGrow = '1';
    }
  });
}

function validateForm(form) {
  const requiredFields = form.querySelectorAll('[required]');
  let valid = true;
  
  requiredFields.forEach(field => {
    if (!field.value.trim()) {
      field.classList.add('border-red-500', 'ring-1', 'ring-red-200');
      field.classList.remove('border-slate-300', 'focus:border-sky-500');
      valid = false;
    } else {
      field.classList.remove('border-red-500', 'ring-1', 'ring-red-200');
      field.classList.add('border-slate-300', 'focus:border-sky-500');
    }
  });
  
  if (!valid) {
    // Scroll to first error
    requiredFields[0].scrollIntoView({ behavior: 'smooth', block: 'center' });
  }
  
  return valid;
}

function toggleGeoList(btn) {
  const list = btn.nextElementSibling;
  const expanded = list.classList.toggle('hidden');
  btn.textContent = expanded ? `View all (${document.querySelectorAll('input[name="geography"]').length - 5})` : 'Hide';
}

// Init forms
document.querySelectorAll('form').forEach(form => {
  form.addEventListener('submit', (e) => {
    if (!validateForm(form)) {
      e.preventDefault();
    }
  });
  
  // Country phone pairs
  const countrySelects = form.querySelectorAll('select[name="country"]');
  countrySelects.forEach((countrySel, idx) => {
    const codeInputs = form.querySelectorAll('input[name="country_code"]');
    const phoneInputs = form.querySelectorAll('input[name="phone"]');
    if (codeInputs[idx] && phoneInputs[idx]) {
      initCountryPhone(countrySel, codeInputs[idx], phoneInputs[idx]);
    }
  });
});

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
    marketFilterForm.querySelectorAll('input[type="checkbox"], select').forEach((input) => {
      input.addEventListener("change", () => {
        marketFilterForm.requestSubmit();
      });
    });
  }
});

