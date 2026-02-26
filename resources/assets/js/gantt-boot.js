// Gantt Theme Application
window.__applyGanttTheme = function (forceRender = false) {
  if (!window.gantt) return;
  const docEl = document.documentElement;
  const isDark = docEl.classList.contains('dark') ||
    docEl.getAttribute('data-theme') === 'dark' ||
    docEl.classList.contains('fi-theme-dark');
  const desiredSkin = isDark ? 'dark' : 'material';

  try {
    gantt.setSkin(desiredSkin);
    if (forceRender || window.__ganttInitedOnce) gantt.render();
  } catch (_) {}
};

// Theme Observer Setup
window.__ensureGanttThemeObserver = function () {
  if (window.__ganttThemeObserver) return;
  const docEl = document.documentElement;
  const observer = new MutationObserver(mutations => {
    mutations.forEach(m => {
      if (m.type === 'attributes' && (m.attributeName === 'class' || m.attributeName === 'data-theme')) {
        setTimeout(() => window.__applyGanttTheme(true), 0);
      }
    });
  });
  try {
    observer.observe(docEl, { attributes: true, attributeFilter: ['class', 'data-theme'] });
    window.__ganttThemeObserver = observer;
  } catch (_) {}

  ['theme-changed', 'dark-mode-toggled', 'color-scheme-changed'].forEach(evt => {
    window.addEventListener(evt, () => setTimeout(() => window.__applyGanttTheme(true), 0));
  });

  window.addEventListener('storage', e => {
    if (!e) return;
    const key = (e.key || '').toLowerCase();
    if (key.includes('theme') || key.includes('color-scheme')) {
      setTimeout(() => window.__applyGanttTheme(true), 0);
    }
  });
};

// String Escape Helper
window.__ganttEscape = window.__ganttEscape || function (str) {
  return (str == null ? '' : String(str))
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;')
    .replace(/'/g, '&#39;');
};

// Config helper
window.__ganttGetConfig = function () {
  const el = document.getElementById('gantt_here');
  if (!el || !el.dataset.ganttConfig) return {};
  try {
    const parsed = JSON.parse(el.dataset.ganttConfig);
    return parsed && typeof parsed === 'object' ? parsed : {};
  } catch (_) {
    return {};
  }
};

// Status Icon SVG Mapper
window.__ganttStatusIconSvg = function (iconClass) {
  const map = {
    'heroicon-s-power': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M5.636 5.636a9 9 0 1 0 12.728 0M12 3v9" /></svg>',
    'heroicon-o-play-circle': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /><path stroke-linecap="round" stroke-linejoin="round" d="M15.91 11.672a.375.375 0 0 1 0 .656l-5.603 3.113a.375.375 0 0 1-.557-.328V8.887c0-.286.307-.466.557-.327l5.603 3.112Z" /></svg>',
    'heroicon-o-pause-circle': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M14.25 9v6m-4.5 0V9M21 12a9 9 0 1 1-18 0 9 9 0 0 1 18 0Z" /></svg>',
    'heroicon-o-check-badge': '<svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" width="18" height="18"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75 11.25 15 15 9.75M21 12c0 1.268-.63 2.39-1.593 3.068a3.745 3.745 0 0 1-1.043 3.296 3.745 3.745 0 0 1-3.296 1.043A3.745 3.745 0 0 1 12 21c-1.268 0-2.39-.63-3.068-1.593a3.746 3.746 0 0 1-3.296-1.043 3.745 3.745 0 0 1-1.043-3.296A3.745 3.745 0 0 1 3 12c0-1.268.63-2.39 1.593-3.068a3.745 3.745 0 0 1 1.043-3.296 3.746 3.746 0 0 1 3.296-1.043A3.746 3.746 0 0 1 12 3c1.268 0 2.39.63 3.068 1.593a3.746 3.746 0 0 1 3.296 1.043 3.746 3.746 0 0 1 1.043 3.296A3.745 3.745 0 0 1 21 12Z" /></svg>'
  };
  return map[iconClass] || '';
};

window.__ganttTemplates = {
  assignee: task => {
    if (!task.assignee) return '';
    const cfg = window.__ganttConfig || {};
    const urlKeys = cfg.avatar_url_fields || ['profile_photo_url', 'profile_photo_path'];
    const nameKeys = cfg.avatar_name_fields || ['name'];
    const fallbackTpl = cfg.avatar_fallback || 'https://ui-avatars.com/api/?name={name}&color=7F9CF5&background=EBF4FF';

    let path = '';
    for (const k of urlKeys) {
      if (task.assignee && task.assignee[k]) { path = task.assignee[k]; break; }
    }
    let name = 'User';
    for (const k of nameKeys) {
      if (task.assignee && task.assignee[k]) { name = task.assignee[k]; break; }
    }

    const avatarUrl = path
      ? ((path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) ? path : '/storage/' + String(path).replace(/^\//, ''))
      : fallbackTpl.replace('{name}', encodeURIComponent(name));
    
    return `<img src="${window.__ganttEscape(avatarUrl)}" alt="${window.__ganttEscape(name)}" class="gantt-assignee-avatar" style="width:24px;height:24px;border-radius:9999px;object-fit:cover;vertical-align:middle;border:1px solid #e5e7eb;display:block;margin:0 auto;" title="${window.__ganttEscape(name)}">`;
  },
  priority: obj => {
    const cfg = window.__ganttConfig || {};
    const colors = cfg.priority_colors || {};
    const high = colors.high || {};
    const med = colors.medium || {};
    const low = colors.low || {};
    const highBg = high.badge_bg || '#fee2e2';
    const highText = high.badge_text || '#b91c1c';
    const medBg = med.badge_bg || '#fef3c7';
    const medText = med.badge_text || '#b45309';
    const lowBg = low.badge_bg || '#dcfce7';
    const lowText = low.badge_text || '#15803d';
    const p = (obj.priority || '').toString().toLowerCase();
    if (p === 'high' || p === '1') return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style="background:${highBg};color:${highText};">High</span>`;
    if (p === 'medium' || p === '2' || p === 'normal') return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style="background:${medBg};color:${medText};">Normal</span>`;
    if (p === 'low' || p === '3') return `<span class="px-2 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider" style="background:${lowBg};color:${lowText};">Low</span>`;
    return (obj.priority ?? '').toString();
  }
};

window.__resolveGanttColumns = function(cols) {
  return cols.map(col => {
    if (col.template && typeof col.template === 'string' && window.__ganttTemplates[col.template]) {
      return { ...col, template: window.__ganttTemplates[col.template] };
    }
    return col;
  });
};

// Gantt Initialization
window.__initGantt = async function () {
  const el = document.getElementById('gantt_here');
  if (!el || !window.gantt) return;

  // Check if gantt container was removed from DOM (e.g., during modal open)
  // If so, reset the initialization flag to reinitialize
  if (!document.body.contains(el)) {
    delete el.dataset.ganttInited;
    return;
  }

  if (el.dataset.ganttInited === '1') {
    window.__ganttConfig = window.__ganttGetConfig();
    window.__ganttInitDropdownFilters();

    // Dynamic column update: check if columns changed since last init
    const latestColsRaw = el.dataset.ganttColumns ? JSON.parse(el.dataset.ganttColumns) : null;
    if (latestColsRaw && window.gantt && window.__resolveGanttColumns) {
        const resolved = window.__resolveGanttColumns(latestColsRaw);
        // Compare with current original columns to see if we need to update
        if (JSON.stringify(resolved) !== JSON.stringify(window.__ganttOriginalColumns)) {
            window.__ganttOriginalColumns = resolved;
            if (typeof applyColumnVisibility === 'function') {
                applyColumnVisibility();
            } else {
                gantt.config.columns = resolved;
                gantt.render();
            }
        }
    }

    // Re-render if the element was temporarily removed and re-added
    if (window.__ganttInitedOnce && window.gantt && el.parentElement) {
      try {
        // Update gantt data if it changed
        const newData = el.dataset.ganttData ? JSON.parse(el.dataset.ganttData) : null;
        if (newData) {
          gantt.clearAll();
          gantt.parse(newData);
        }
        window.gantt.render();
      } catch(e) {
        console.error('Error updating gantt data:', e);
        // If render fails, reset and reinitialize
        delete el.dataset.ganttInited;
        window.__initGantt();
      }
    }
    return;
  }
  el.dataset.ganttInited = '1';

  window.__ganttConfig = window.__ganttGetConfig();
  window.__applyGanttTheme(false);
  gantt.plugins({ quick_info: true, export_api: true, marker: true });
  gantt.config.date_format = "%Y-%m-%d %H:%i:%s";
  gantt.config.row_height = 42;
  gantt.config.bar_height = 28;
  gantt.config.round_dnd_dates = false;
  gantt.config.drag_progress = true;
  gantt.config.details_on_dblclick = false; // Usually double-click is better not to trigger default lightbox if you use custom Filament modals
  gantt.config.show_errors = false;
  gantt.config.grid_width = 380;
  gantt.config.grid_resize = true;
  gantt.config.grid_resize_columns = true;
  
  // Custom tooltips
  gantt.templates.tooltip_text = function(start, end, task){
    const format = gantt.date.date_to_str("%Y-%m-%d");
    return `<b>Task:</b> ${window.__ganttEscape(task.text)}<br/><b>Start:</b> ${format(start)}<br/><b>End:</b> ${format(end)}<br/><b>Progress:</b> ${Math.round(task.progress * 100)}%`;
  };

  const rawCols = el.dataset.ganttColumns ? JSON.parse(el.dataset.ganttColumns) : [];
  gantt.config.columns = window.__resolveGanttColumns(rawCols);
  window.__ganttOriginalColumns = [...gantt.config.columns];

  // Today Marker
  const dateToStr = gantt.date.date_to_str(gantt.config.task_date);
  gantt.addMarker({
    start_date: new Date(),
    css: "today_marker",
    text: "Today",
    title: "Today: " + dateToStr(new Date())
  });

  // Ensure zero-duration tasks (same start & end) are visible by giving them minimal length
  if (!window.__ganttZeroDurationHooked) {
    gantt.attachEvent('onTaskLoading', function(task){
      if (task.start_date && task.end_date && task.start_date.getTime && task.end_date.getTime && task.start_date.getTime() === task.end_date.getTime()) {
        // add 1 hour so it renders as a small bar; adjust if you prefer 1 day
        task.end_date = new Date(task.end_date.getTime() + 60*60*1000);
      }
      return true;
    });
    window.__ganttZeroDurationHooked = true;
  }

  gantt.templates.task_class = (start, end, task) => {
    const p = (task.priority || '').toString().toLowerCase();
    if (p === '1' || p === 'high') return "high";
    if (p === '2' || p === 'medium' || p === 'normal') return "medium";
    if (p === '3' || p === 'low') return "low";
    return "";
  };

  gantt.serverList("status", [
    { key: "not_started", label: "Not Started", backgroundColor: "#9E9E9E", textColor: "#fff" },
    { key: "in_progress", label: "In Progress", backgroundColor: "#03A9F4", textColor: "#fff" },
    { key: "paused", label: "Paused", backgroundColor: "#FF9800", textColor: "#fff" },
    { key: "completed", label: "Completed", backgroundColor: "#4CAF50", textColor: "#fff" }
  ]);

  gantt.templates.grid_row_class = () => "has-icon";

  gantt.templates.task_text = (start, end, task) => {
    const iconClass = task.status_icon || '';
    const iconHtml = iconClass
      ? `<span class="gantt-status-icon" style="margin-right:6px;display:inline-flex;align-items:center;vertical-align:middle;">${window.__ganttStatusIconSvg(iconClass)}</span>`
      : '';
    
    const cfg = window.__ganttConfig || {};
    const urlKeys = cfg.avatar_url_fields || ['profile_photo_url', 'profile_photo_path'];
    const nameKeys = cfg.avatar_name_fields || ['name'];
    const fallbackTpl = cfg.avatar_fallback || 'https://ui-avatars.com/api/?name={name}&color=7F9CF5&background=EBF4FF';

    let name = 'User';
    if (task.assignee) {
      for (const k of nameKeys) {
        if (task.assignee[k]) { name = task.assignee[k]; break; }
      }
    }

    let avatarUrl = '';
    if (task.assignee) {
      let path = '';
      for (const k of urlKeys) {
        if (task.assignee[k]) { path = task.assignee[k]; break; }
      }
      avatarUrl = path
        ? ((path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) ? path : '/storage/' + String(path).replace(/^\//, ''))
        : fallbackTpl.replace('{name}', encodeURIComponent(name));
    }

    const assigneeHtml = avatarUrl
      ? `<img src="${window.__ganttEscape(avatarUrl)}" alt="${window.__ganttEscape(name)}" title="${window.__ganttEscape(name)}" class="gantt-assignee-avatar" style="width:24px;height:24px;border-radius:9999px;object-fit:cover;margin-right:8px;vertical-align:middle;border:1.5px solid #fff;flex-shrink:0;">`
      : '';
    return assigneeHtml + iconHtml + window.__ganttEscape(task.text || '');
  };

  window.__ganttInitDropdownFilters();

  gantt.init('gantt_here');
  window.__ganttInitedOnce = true;

  // Row height controls (resize gantt rows)
  if (!window.__ganttRowHeightDefaults) {
    window.__ganttRowHeightDefaults = {
      row: gantt.config.row_height,
      bar: gantt.config.bar_height
    };
  }
  window.__ganttResizeRows = function (delta) {
    if (!window.gantt) return;
    const minRow = 26;
    const maxRow = 90;
    const minBar = 16;
    const maxBar = 70;
    const nextRow = Math.min(maxRow, Math.max(minRow, gantt.config.row_height + delta));
    const nextBar = Math.min(maxBar, Math.max(minBar, Math.round(gantt.config.bar_height + (delta * 0.7))));
    gantt.config.row_height = nextRow;
    gantt.config.bar_height = Math.min(nextBar, nextRow - 8);
    gantt.render();
  };
  window.__ganttResetRows = function () {
    if (!window.gantt || !window.__ganttRowHeightDefaults) return;
    gantt.config.row_height = window.__ganttRowHeightDefaults.row;
    gantt.config.bar_height = window.__ganttRowHeightDefaults.bar;
    gantt.render();
  };

  const dataGanttData = el.dataset.ganttData ? JSON.parse(el.dataset.ganttData) : null;
  gantt.parse(dataGanttData || { data: [], links: [] });
  window.__ganttInitDropdownFilters();

  // Apply visibility from checkboxes after parse
  if (typeof applyColumnVisibility === 'function') {
    applyColumnVisibility();
  }

  // Ensure a paint after init (helps on hard refresh/slow layouts)
  setTimeout(() => {
    try { 
        if (typeof applyColumnVisibility === 'function') applyColumnVisibility();
        gantt.render(); 
    } catch (_) {}
  }, 50);

  // --- API sync helpers (configure base URL if needed) ---
  window.__ganttApiBase = window.__ganttApiBase || '/api/tasks'; // change if your endpoint differs
  window.__ganttGetCsrf = function(){
    const m = document.querySelector('meta[name="csrf-token"]');
    return m ? m.getAttribute('content') : '';
  };
  async function __ganttApi(method, id, payload){
    const url = window.__ganttApiBase.replace(/\/$/, '') + '/' + id;
    try {
      const res = await fetch(url, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Accept': 'application/json',
          'X-CSRF-TOKEN': window.__ganttGetCsrf()
        },
        body: method === 'DELETE' ? undefined : JSON.stringify(payload || {})
      });
      if(!res.ok) console.warn('Gantt API error', method, url, res.status);
      return await res.json().catch(()=>null);
    } catch(err){
      console.error('Gantt API request failed', err);
      return null;
    }
  }
  // -------------------------------------------------------

  if (!window.__ganttChangeEventsHooked) {
    window.__onGanttTaskChanged = window.__onGanttTaskChanged || function (action, task, extra) {};

    // Pending changes storage
    window.__ganttPendingChanges = window.__ganttPendingChanges || {};

    function __queuePending(id){
      window.__ganttPendingChanges[id] = true;
      __updateAcceptButton();
    }
    function __flushPending(){
      const ids = Object.keys(window.__ganttPendingChanges);
      if(!ids.length) return;
      ids.forEach(id=>{
        try {
          const task = gantt.getTask(id);
          // Fix: add 1 day to end_date before sending
          if (task && task.end_date) {
            let end = (task.end_date instanceof Date) ? new Date(task.end_date) : new Date(task.end_date);
            // Only add if time is 00:00:00 or 23:59:59 (to avoid double add)
            if (end.getHours() === 0 && end.getMinutes() === 0 && end.getSeconds() === 0) {
              end.setDate(end.getDate() + 1);
              task.end_date = end;
            }
          }
          __ganttApi('PUT', id, task);
        } catch(e){}
      });
      window.__ganttPendingChanges = {};
      __updateAcceptButton();
      console.log('[Gantt Pending Changes Saved]', ids);
    }

    function __updateAcceptButton(){
      let btn = document.getElementById('gantt_accept_changes_btn');
      if(!btn){
        // try to place near zoom / export controls
        const container = document.querySelector('.gantt_control') || document.querySelector('.zoom_toggle')?.parentElement || document.body;
        btn = document.createElement('button');
        btn.type = 'button';
        btn.id = 'gantt_accept_changes_btn';
        btn.textContent = 'Save Changes';
        btn.style.display = 'none';
        btn.style.padding = '6px 12px';
        btn.style.borderRadius = '6px';
        btn.style.background = '#2563eb';
        btn.style.color = '#fff';
        btn.style.fontSize = '12px';
        btn.style.fontWeight = '600';
        btn.style.boxShadow = '0 1px 2px rgba(0,0,0,.15)';
        btn.style.transition = 'background .15s';
        btn.addEventListener('mouseover', ()=> btn.style.background = '#1d4ed8');
        btn.addEventListener('mouseout', ()=> btn.style.background = '#2563eb');
        btn.addEventListener('click', __flushPending);
        container.appendChild(btn);
      }
      const has = Object.keys(window.__ganttPendingChanges).length > 0;
      btn.style.display = has ? 'inline-block' : 'none';
    }

    // Removed confirm dialog; allow drag/edit freely, queue save
    // gantt.attachEvent('onBeforeTaskChanged', function (id, task) { return window.confirm('Are you sure you want to update this task?'); });

    // On update -> queue only (do not save yet)
    gantt.attachEvent('onAfterTaskUpdate', function (id, task) {
      window.__onGanttTaskChanged('update', task);
      __queuePending(id);
      console.log('[Gantt Task Updated - queued]', id, task);
    });
    // On add -> queue
    gantt.attachEvent('onAfterTaskAdd', function (id, task) {
      window.__onGanttTaskChanged('add', task);
      __queuePending(id);
      console.log('[Gantt Task Added - queued]', id, task);
    });
    // On delete -> immediate delete (can adapt if you want queue for deletes too)
    gantt.attachEvent('onAfterTaskDelete', function (id, task) {
      window.__onGanttTaskChanged('delete', task);
      __ganttApi('DELETE', id);
      delete window.__ganttPendingChanges[id];
      __updateAcceptButton();
      console.log('[Gantt Task Deleted]', id, task);
    });

    window.__ganttChangeEventsHooked = true;
  }
  window.__ensureGanttThemeObserver();
};

// Retry init on refresh/hard reloads where assets or DOM race
window.__ensureGanttInit = function (retries = 6) {
  const el = document.getElementById('gantt_here');
  if (!el || !window.gantt) return;
  const needsInit = el.dataset.ganttInited !== '1' || !gantt.$root || el.offsetHeight === 0;
  if (needsInit) {
    try { delete el.dataset.ganttInited; } catch (_) {}
    try { window.__initGantt(); } catch (_) {}
  }
  if (retries > 0) {
    setTimeout(() => window.__ensureGanttInit(retries - 1), 250);
  }
};

// Priority Filter Wiring
window.__ganttNormalizePriority = function (val) {
  const raw = (val || '').toString().toLowerCase();
  const aliases = { '1': 'high', '2': 'medium', '3': 'low', 'normal': 'medium' };
  return aliases[raw] || raw;
};

window.__ganttExtractValue = function (task, key) {
  if (!task) return '';
  if (key === 'assignee') {
    const a = task.assignee;
    if (!a) return '';
    if (typeof a === 'string') return a;
    return a.name || a.full_name || a.email || '';
  }
  if (key === 'project') {
    const p = task.project || task.project_name || task.projectTitle;
    if (!p) return '';
    if (typeof p === 'string') return p;
    return p.name || p.title || '';
  }
  if (key === 'status') {
    const s = task.status || task.status_name || task.state;
    if (!s) return '';
    if (typeof s === 'string') return s;
    return s.name || s.title || '';
  }
  if (key === 'type') {
    const t = task.task_type || task.type_name || task.type;
    if (!t) return '';
    if (typeof t === 'string') return t;
    return t.name || t.title || '';
  }
  if (key === 'priority') {
    return window.__ganttNormalizePriority(task.priority);
  }
  return '';
};

window.__ganttFilters = window.__ganttFilters || {
  project: new Set(),
  assignee: new Set(),
  status: new Set(),
  type: new Set(),
  priority: new Set(),
};

window.__ganttCollectFilterOptions = function () {
  const options = {
    project: new Set(),
    assignee: new Set(),
    status: new Set(),
    type: new Set(),
    priority: new Set(),
  };
  if (!window.gantt) return options;
  gantt.eachTask(task => {
    if (task.type === 'project') return;
    ['project', 'assignee', 'status', 'type', 'priority'].forEach(key => {
      const val = window.__ganttExtractValue(task, key);
      if (val) options[key].add(val);
    });
  });
  return options;
};

window.__ganttRenderFilterList = function (key, values) {
  const list = document.querySelector(`[data-filter-options="${key}"]`);
  if (!list) return;
  const sorted = Array.from(values).sort((a, b) => a.localeCompare(b));
  const renderItem = (value, label, isAll = false) => {
    const item = document.createElement('button');
    item.type = 'button';
    item.className = `gantt_filter_item${isAll ? ' is-all' : ''}`;
    item.dataset.value = value;
    item.innerHTML = `<span class="gantt_filter_check">✓</span><span>${window.__ganttEscape(label)}</span>`;
    item.addEventListener('click', () => {
      const set = window.__ganttFilters[key];
      if (isAll) {
        set.clear();
      } else {
        if (set.has(value)) set.delete(value);
        else set.add(value);
      }
      window.__ganttSyncFilterUi(key);
      if (window.gantt) gantt.render();
    });
    return item;
  };
  list.innerHTML = '';
  list.appendChild(renderItem('__all__', 'All', true));
  if (key === 'priority') {
    const labels = { high: 'High', medium: 'Medium', low: 'Low' };
    ['high', 'medium', 'low'].forEach(p => {
      if (sorted.includes(p)) {
        list.appendChild(renderItem(p, labels[p]));
      }
    });
  } else {
    sorted.forEach(v => list.appendChild(renderItem(v, v)));
  }
  window.__ganttSyncFilterUi(key);
};

window.__ganttSyncFilterUi = function (key) {
  const list = document.querySelector(`[data-filter-options="${key}"]`);
  if (!list) return;
  const set = window.__ganttFilters[key];
  const items = list.querySelectorAll('.gantt_filter_item');
  items.forEach(item => {
    const val = item.dataset.value;
    const isAll = item.classList.contains('is-all');
    const active = isAll ? set.size === 0 : set.has(val);
    item.classList.toggle('is-active', active);
  });
};

window.__ganttApplyDropdownFilters = function () {
  if (!window.gantt) return;
  if (window.__ganttOnBeforeTaskDisplayId) {
    gantt.detachEvent(window.__ganttOnBeforeTaskDisplayId);
  }
  const passes = (task) => {
    const keys = ['project', 'assignee', 'status', 'type', 'priority'];
    for (const key of keys) {
      const set = window.__ganttFilters[key];
      if (!set || set.size === 0) continue;
      const val = window.__ganttExtractValue(task, key);
      if (!val || !set.has(val)) return false;
    }
    return true;
  };
  const passesDeep = (id) => {
    const t = gantt.getTask(id);
    if (passes(t)) return true;
    const children = gantt.getChildren(id) || [];
    return children.some(childId => passesDeep(childId));
  };
  window.__ganttOnBeforeTaskDisplayId = gantt.attachEvent("onBeforeTaskDisplay", (id) => {
    return passesDeep(id);
  });
};

window.__ganttInitDropdownFilters = function () {
  const hasLists = document.querySelector('[data-filter-options="priority"]');
  if (!hasLists || !window.gantt) return;
  const opts = window.__ganttCollectFilterOptions();
  Object.keys(opts).forEach(key => window.__ganttRenderFilterList(key, opts[key]));
  window.__ganttApplyDropdownFilters();
};

// Sorting
window.__ganttSortState = window.__ganttSortState || { p_direction: false, n_direction: false };
window.sortByPriority = function () {
  if (!window.gantt) return;
  gantt.sort("priority", window.__ganttSortState.p_direction);
  window.__ganttSortState.p_direction = !window.__ganttSortState.p_direction;
};
window.sortByName = function () {
  if (!window.gantt) return;
  gantt.sort("text", window.__ganttSortState.n_direction);
  window.__ganttSortState.n_direction = !window.__ganttSortState.n_direction;
};

function exportGantt(mode) {
  var opts = { header: '' };
  if (mode === "png") {
    gantt.exportToPNG(opts);
  } else if (mode === "pdf") {
    gantt.exportToPDF(opts);
  }
}

function toggleMode(toggle) {
		__ensureZoomInit();
		if(!gantt.$zoomInited) return;
		gantt.$zoomToFit = !gantt.$zoomToFit;
		if (gantt.$zoomToFit) {
			if (toggle && toggle.innerHTML !== undefined) toggle.innerHTML = "Set default Scale";
			saveConfig();
			zoomToFit();
		} else {
			if (toggle && toggle.innerHTML !== undefined) toggle.innerHTML = "Zoom to Fit";
			restoreConfig();
			gantt.render();
		}
	}

	var cachedSettings = {};

	function saveConfig() {
		var config = gantt.config;
		cachedSettings = {};
		cachedSettings.scales = config.scales;
		cachedSettings.start_date = config.start_date;
		cachedSettings.end_date = config.end_date;
		cachedSettings.scroll_position = gantt.getScrollState();
	}

	function restoreConfig() {
		applyConfig(cachedSettings);
	}

	function applyConfig(config, dates) {

		gantt.config.scales = config.scales;

		// restore the previous scroll position
		if (config.scroll_position) {
			setTimeout(function(){
				gantt.scrollTo(config.scroll_position.x, config.scroll_position.y)
			},4)
		}
	}


	function zoomToFit() {
		__ensureZoomInit();
		if(!gantt.$zoomInited) return;
		var project = gantt.getSubtaskDates(),
			areaWidth = gantt.$task.offsetWidth,
			scaleConfigs = zoomConfig.levels;

		for (var i = 0; i < scaleConfigs.length; i++) {
			var columnCount = getUnitsBetween(project.start_date, project.end_date, scaleConfigs[i].scales[scaleConfigs[i].scales.length-1].unit, scaleConfigs[i].scales[0].step);
			if ((columnCount + 2) * gantt.config.min_column_width <= areaWidth) {
				break;
			}
		}


		if (i == scaleConfigs.length) {
			i--;
		}

		gantt.ext.zoom.setLevel(scaleConfigs[i].name);
		applyConfig(scaleConfigs[i], project);
	}

	// get number of columns in timeline
	function getUnitsBetween(from, to, unit, step) {
		var start = new Date(from),
			end = new Date(to);
		var units = 0;
		while (start.valueOf() < end.valueOf()) {
			units++;
			start = gantt.date.add(start, step, unit);
		}
		return units;
	}

	function zoom_in(){
		__ensureZoomInit();
		if(gantt.$zoomInited) gantt.ext.zoom.zoomIn();
		gantt.$zoomToFit = false;
		var zoomToggle = document.querySelector(".zoom_toggle");
		if (zoomToggle) zoomToggle.innerHTML = "Zoom to Fit";
	}
	function zoom_out(){
		__ensureZoomInit();
		if(gantt.$zoomInited) gantt.ext.zoom.zoomOut();
		gantt.$zoomToFit = false;
		var zoomToggle = document.querySelector(".zoom_toggle");
		if (zoomToggle) zoomToggle.innerHTML = "Zoom to Fit";
	}


	var zoomConfig = {
		levels: [
			// hours
			{
				name:"hour",
				scale_height: 27,
				scales:[
					{unit:"day", step: 1, format:"%d %M"},
					{unit:"hour", step: 1, format:"%H:%i"},
				]
			},
			// days
			{
				name:"day",
				scale_height: 27,
				scales:[
					{unit: "day", step: 1, format: "%d %M"}
				]
			},
			// weeks
			{
				name:"week",
				scale_height: 50,
				scales:[
					{unit: "week", step: 1, format: function (date) {
						var dateToStr = gantt.date.date_to_str("%d %M");
						var endDate = gantt.date.add(date, 7 - date.getDay(), "day");
						var weekNum = gantt.date.date_to_str("%W")(date);
						return "#" + weekNum + ", " + dateToStr(date) + " - " + dateToStr(endDate);
					}},
					{unit: "day", step: 1, format: "%j %D"}
				]
			},
			// months
			{
				name:"month",
				scale_height: 50,
				scales:[
					{unit: "month", step: 1, format: "%F, %Y"},
					{unit: "week", step: 1, format: function (date) {
						var dateToStr = gantt.date.date_to_str("%d %M");
						var endDate = gantt.date.add(date, 7 - date.getDay(), "day");
						return dateToStr(date) + " - " + dateToStr(endDate);
					}}
				]
			},
			// quarters
			{
				name:"quarter",
				height: 50,
				scales:[
					{
						unit: "quarter", step: 3, format: function (date) {
							var dateToStr = gantt.date.date_to_str("%M %y");
							var endDate = gantt.date.add(date, 2 - date.getMonth() % 3, "month");
							return dateToStr(date) + " - " + dateToStr(endDate);
						}
					},
					{unit: "month", step: 1, format: "%M"},
				]
			},
			// years
			{
				name:"year",
				scale_height: 50,
				scales:[
					{unit: "year", step: 5, format: function (date) {
						var dateToStr = gantt.date.date_to_str("%Y");
						var endDate = gantt.date.add(gantt.date.add(date, 5, "year"), -1, "day");
						return dateToStr(date) + " - " + dateToStr(endDate);
					}}
				]
			},
			// decades
			{
				name:"year",
				scale_height: 50,
				scales:[
					{unit: "year", step: 100, format: function (date) {
						var dateToStr = gantt.date.date_to_str("%Y");
						var endDate = gantt.date.add(gantt.date.add(date, 100, "year"), -1, "day");
						return dateToStr(date) + " - " + dateToStr(endDate);
					}},
					{unit: "year", step: 10, format: function (date) {
						var dateToStr = gantt.date.date_to_str("%Y");
						var endDate = gantt.date.add(gantt.date.add(date, 10, "year"), -1, "day");
						return dateToStr(date) + " - " + dateToStr(endDate);
					}},
				]
			},
		],
		element: function(){
			return gantt.$root.querySelector(".gantt_task");
		}
	};

	// expose zoomConfig globally for re-init safety
	window.__ganttZoomConfig = zoomConfig;

	function __ensureZoomInit(){
		if(!gantt.ext || !gantt.ext.zoom) return; // plugin missing
		if(!gantt.$zoomInited){
			gantt.ext.zoom.init(window.__ganttZoomConfig);
			try{ gantt.ext.zoom.setLevel("day"); }catch(e){}
			gantt.$zoomInited = true;
		}
	}

	// patch existing functions to guard
	var __origZoomToFit = zoomToFit;
	zoomToFit = function(){
		__ensureZoomInit();
		if(!gantt.$zoomInited) return;
		__origZoomToFit();
	};
	var __origZoomIn = zoom_in;
	zoom_in = function(){ __ensureZoomInit(); if(gantt.$zoomInited) __origZoomIn(); };
	var __origZoomOut = zoom_out;
	zoom_out = function(){ __ensureZoomInit(); if(gantt.$zoomInited) __origZoomOut(); };
	var __origToggleMode = toggleMode;
	toggleMode = function(toggle){ __ensureZoomInit(); if(gantt.$zoomInited) __origToggleMode(toggle); };

	if (window.gantt) {
		gantt.config.fit_tasks = true;
		// defer zoom init until first use to avoid race conditions
	}

// Sort Button Wiring
const __ganttStorageKey = "filament_gantt_columns_v1";

function __loadColumnPrefs() {
  try {
    const raw = localStorage.getItem(__ganttStorageKey);
    if (!raw) return null;
    const parsed = JSON.parse(raw);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function __saveColumnPrefs(pref) {
  try {
    localStorage.setItem(__ganttStorageKey, JSON.stringify(pref));
  } catch (_) {}
}

function __getServerFilterPrefs() {
  const el = document.getElementById('gantt_here');
  if (!el || !el.dataset.ganttFilters) return null;
  try {
    const parsed = JSON.parse(el.dataset.ganttFilters);
    if (!parsed || typeof parsed !== "object") return null;
    return parsed;
  } catch (_) {
    return null;
  }
}

function __applyServerFilterPrefs(prefs) {
  if (!prefs) return;
  const { filters, priorities, sort, columns } = prefs;

  if (filters && typeof filters === "object") {
    ['project', 'assignee', 'status', 'type', 'priority'].forEach(key => {
      const list = filters[key];
      if (Array.isArray(list)) {
        window.__ganttFilters[key].clear();
        list.forEach(v => window.__ganttFilters[key].add(v));
        window.__ganttSyncFilterUi(key);
      }
    });
  } else if (priorities && typeof priorities === "object") {
    window.__ganttFilters.priority.clear();
    Object.keys(priorities).forEach(p => {
      if (priorities[p]) window.__ganttFilters.priority.add(p);
    });
    window.__ganttSyncFilterUi('priority');
  }
  if (window.__ganttApplyDropdownFilters) window.__ganttApplyDropdownFilters();
  if (window.gantt) gantt.render();

  if (sort) {
    const sortRadios = document.querySelectorAll('input[name="sort_option"]');
    sortRadios.forEach(r => {
      r.checked = r.value === sort;
    });
    const selected = Array.from(sortRadios).find(r => r.checked);
    if (selected) {
      selected.dispatchEvent(new Event('change', { bubbles: true }));
    }
  }

  if (columns && typeof columns === "object") {
    const colToggles = document.querySelectorAll('.gantt-col-toggle');
    if (colToggles.length) {
      colToggles.forEach(cb => {
        const col = cb.getAttribute("data-col");
        if (col && Object.prototype.hasOwnProperty.call(columns, col)) {
          cb.checked = !!columns[col];
        }
      });
      applyColumnVisibility();
      __saveColumnPrefs(columns);
    }
  }
}

document.addEventListener("DOMContentLoaded", () => {
  const btnPriority = document.getElementById("sort_priority");
  const btnName = document.getElementById("sort_name");
  if (btnPriority) btnPriority.addEventListener("click", sortByPriority);
  if (btnName) btnName.addEventListener("click", sortByName);

  // Radio sort option handling
  const sortRadios = document.querySelectorAll('input[name="sort_option"]');
  const updateSortUi = () => {
    sortRadios.forEach(radio => {
      const label = radio.closest('label');
      if (!label) return;
      if (radio.checked) label.classList.add('is-active');
      else label.classList.remove('is-active');
    });
  };
  if (sortRadios.length) {
    sortRadios.forEach(r => {
      r.addEventListener('change', e => {
        if (!e.target.checked) return;
        const val = e.target.value;
        if (val === 'priority') { window.__ganttSortState.p_direction = false; window.sortByPriority(); }
        else if (val === 'name') { window.__ganttSortState.n_direction = false; window.sortByName(); }
        updateSortUi();
      });
    });
    const initial = Array.from(sortRadios).find(r => r.checked);
    if (initial) {
      if (initial.value === 'priority') { window.__ganttSortState.p_direction = false; window.sortByPriority(); }
      else if (initial.value === 'name') { window.__ganttSortState.n_direction = false; window.sortByName(); }
    }
    updateSortUi();
  }

  // Column visibility toggles
  const colToggles = document.querySelectorAll('.gantt-col-toggle');
  if (colToggles.length) {
    const serverPrefs = __getServerFilterPrefs();
    const saved = serverPrefs?.columns || __loadColumnPrefs();
    
    if (saved) {
      colToggles.forEach(cb => {
        const col = cb.getAttribute("data-col");
        if (col && Object.prototype.hasOwnProperty.call(saved, col)) {
          cb.checked = !!saved[col];
        }
      });
    }
    colToggles.forEach(cb => cb.addEventListener('change', () => applyColumnVisibility()));
    if (window.applyColumnVisibility) window.applyColumnVisibility();
  }

  const serverPrefs = __getServerFilterPrefs();
  if (serverPrefs) {
    __applyServerFilterPrefs(serverPrefs);
  }

  // Ensure gantt is visible on initial load
  setTimeout(() => window.__ensureGanttInit && window.__ensureGanttInit(6), 80);
});

window.addEventListener('load', () => {
  setTimeout(() => window.__ensureGanttInit && window.__ensureGanttInit(6), 120);
});

window.applyColumnVisibility = function() {
  if (!window.gantt || !window.__ganttOriginalColumns) return;

  gantt.config.columns = window.__ganttOriginalColumns.filter(col => {
    const toggle = document.querySelector(`.gantt-col-toggle[data-col="${col.name}"]`);
    if (!toggle) return true;
    return toggle.checked;
  });
  
  gantt.render();

  // Persist user preference
  const toggles = document.querySelectorAll('.gantt-col-toggle');
  if (toggles.length) {
    const pref = {};
    toggles.forEach(cb => {
      const col = cb.getAttribute("data-col");
      if (col) pref[col] = !!cb.checked;
    });
    __saveColumnPrefs(pref);
  }
}

window.__ganttGetFilterState = function () {
  const filters = {
    filters: {
      project: [],
      assignee: [],
      status: [],
      type: [],
      priority: [],
    },
    priorities: {},
    sort: null,
    columns: {},
  };

  ['project', 'assignee', 'status', 'type', 'priority'].forEach(key => {
    const set = window.__ganttFilters?.[key];
    if (set && set.size > 0) {
      filters.filters[key] = Array.from(set);
    }
  });
  if (window.__ganttFilters?.priority) {
    window.__ganttFilters.priority.forEach(p => { filters.priorities[p] = true; });
  }

  const sortRadios = document.querySelectorAll('input[name="sort_option"]');
  const selected = Array.from(sortRadios).find(r => r.checked);
  filters.sort = selected ? selected.value : null;

  const toggles = document.querySelectorAll('.gantt-col-toggle');
  toggles.forEach(cb => {
    const col = cb.getAttribute("data-col");
    if (col) filters.columns[col] = !!cb.checked;
  });

  return filters;
};

window.__ganttSaveFilters = function () {
  const filters = window.__ganttGetFilterState ? window.__ganttGetFilterState() : null;
  if (!filters) return;
  try {
    const host = document.querySelector('[data-gantt-livewire-id]') || document.querySelector('[wire\\:id]');
    const id = host
      ? (host.getAttribute('data-gantt-livewire-id') || host.getAttribute('wire:id'))
      : null;
    if (window.Livewire && id) {
      const component = window.Livewire.find(id);
      if (component && typeof component.call === 'function') {
        component.call('saveGanttFilters', filters);
      }
    }
  } catch (_) {}
};

// Livewire & Custom Event Hooks
document.addEventListener('livewire:load', () => {
  if (window.Livewire && Livewire.hook) {
    // Handle morphing updates
    Livewire.hook('morph.updated', () => {
      setTimeout(window.__initGantt, 50);
    });
    
    // Handle navigation between pages
    Livewire.hook('element.updated', () => {
      setTimeout(window.__initGantt, 50);
    });
  }
});

// Handle Livewire navigation events (v3+)
window.addEventListener('livewire:navigated', () => {
  setTimeout(window.__initGantt, 100);
});

// Handle custom init-gantt event
window.addEventListener('init-gantt', () => {
  setTimeout(window.__initGantt, 100);
});

// Monitor for modal/dialog opens and closes to reinitialize gantt
const observer = new MutationObserver((mutations) => {
  const ganttEl = document.getElementById('gantt_here');
  if (!ganttEl) return;
  
  // Check if gantt element is visible and in DOM
  mutations.forEach((mutation) => {
    if (mutation.type === 'childList' || mutation.type === 'attributes') {
      // Reset gantt if it was removed from DOM
      if (!document.body.contains(ganttEl) && ganttEl.dataset.ganttInited) {
        delete ganttEl.dataset.ganttInited;
      }
      
      // Reinitialize if gantt is back in DOM but not initialized
      if (document.body.contains(ganttEl) && ganttEl.dataset.ganttInited !== '1') {
        setTimeout(window.__initGantt, 100);
      }
    }
  });
});

// Start observing the document for changes
if (document.body) {
  observer.observe(document.body, {
    childList: true,
    subtree: true,
    attributes: true,
    attributeFilter: ['class', 'style', 'data-*']
  });
}
