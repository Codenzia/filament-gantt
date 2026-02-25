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
    const path = task.assignee.profile_photo_url || task.assignee.profile_photo_path || '';
    const name = task.assignee.name || 'User';
    const avatarUrl = path 
      ? ((path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) ? path : '/storage/' + path.replace(/^\//, ''))
      : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&color=7F9CF5&background=EBF4FF`;
    
    return `<img src="${window.__ganttEscape(avatarUrl)}" alt="${window.__ganttEscape(name)}" class="gantt-assignee-avatar" style="width:24px;height:24px;border-radius:9999px;object-fit:cover;vertical-align:middle;border:1px solid #e5e7eb;display:block;margin:0 auto;" title="${window.__ganttEscape(name)}">`;
  },
  priority: obj => {
    const p = (obj.priority || '').toString().toLowerCase();
    if (p === 'high' || p === '1') return '<span class="px-2 py-0.5 rounded-full bg-red-100 text-red-700 text-[10px] font-bold uppercase tracking-wider">High</span>';
    if (p === 'medium' || p === '2' || p === 'normal') return '<span class="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] font-bold uppercase tracking-wider">Normal</span>';
    if (p === 'low' || p === '3') return '<span class="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-700 text-[10px] font-bold uppercase tracking-wider">Low</span>';
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
    if (!document.getElementById('filters_wrapper')?.dataset.filtersInited) {
      window.__wireGanttPriorityFilters();
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
  
  // Custom tooltips
  gantt.templates.tooltip_text = function(start, end, task){
    const format = gantt.date.date_to_str("%Y-%m-%d");
    return `<b>Task:</b> ${window.__ganttEscape(task.text)}<br/><b>Start:</b> ${format(start)}<br/><b>End:</b> ${format(end)}<br/><b>Progress:</b> ${Math.round(task.progress * 100)}%`;
  };

  const rawCols = el.dataset.ganttColumns ? JSON.parse(el.dataset.ganttColumns) : [
    { name: "text", label: "Task name", tree: true, width: "*", resize: true },
    { name: "start_date", label: "Start time", align: "center", resize: true },
    { name: "priority", label: "Priority", align: "center", width: 90, template: "priority" },
    { name: "status", label: "Status", align: "center", width: 90, resize: true },
  ];
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
    
    let avatarUrl = '';
    const name = task.assignee ? (task.assignee.name || 'User') : '';
    if (task.assignee) {
      const path = task.assignee.profile_photo_url || task.assignee.profile_photo_path || '';
      avatarUrl = path 
        ? ((path.startsWith('http') || path.startsWith('//') || path.startsWith('data:')) ? path : '/storage/' + path.replace(/^\//, ''))
        : `https://ui-avatars.com/api/?name=${encodeURIComponent(name)}&color=7F9CF5&background=EBF4FF`;
    }

    const assigneeHtml = avatarUrl
      ? `<img src="${window.__ganttEscape(avatarUrl)}" alt="${window.__ganttEscape(name)}" title="${window.__ganttEscape(name)}" class="gantt-assignee-avatar" style="width:24px;height:24px;border-radius:9999px;object-fit:cover;margin-right:8px;vertical-align:middle;border:1.5px solid #fff;flex-shrink:0;">`
      : '';
    return assigneeHtml + iconHtml + window.__ganttEscape(task.text || '');
  };

  window.__wireGanttPriorityFilters();

  gantt.init('gantt_here');
  window.__ganttInitedOnce = true;

  const dataGanttData = el.dataset.ganttData ? JSON.parse(el.dataset.ganttData) : null;
  gantt.parse(dataGanttData || { data: [], links: [] });

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

// Priority Filter Wiring
window.__wireGanttPriorityFilters = function () {
  const wrap = document.getElementById('filters_wrapper');
  if (!wrap || wrap.dataset.filtersInited === '1') return;

  const inputs = wrap.querySelectorAll('input[type="checkbox"]');
  const updateIcon = inputEl => {
    const label = inputEl.closest('label');
    if (!label) return;
    const icon = label.querySelector('i.material-icons');
    label.classList.toggle('checked_label', inputEl.checked);
    if (icon) {
      icon.textContent = inputEl.checked ? 'check_box' : 'check_box_outline_blank';
      icon.classList.toggle('icon_color', inputEl.checked);
    }
  };

  inputs.forEach(updateIcon);

  inputs.forEach(input => {
    input.addEventListener('change', function () {
      updateIcon(this);
      if (window.gantt) gantt.render();
    });
  });

  function hasPriority(taskId, priorityName) {
    const t = gantt.getTask(taskId);
    const tPri = (t.priority || '').toString().toLowerCase();
    const pNorm = (priorityName || '').toString().toLowerCase();
    const aliases = { '1': 'high', '2': 'medium', '3': 'low', 'normal': 'medium' };
    const normTask = aliases[tPri] || tPri;
    const normWant = aliases[pNorm] || pNorm;
    if (normTask === normWant) return true;
    return (gantt.getChildren(taskId) || []).some(childId => hasPriority(childId, pNorm));
  }

  if (window.__ganttOnBeforeTaskDisplayId) {
    gantt.detachEvent(window.__ganttOnBeforeTaskDisplayId);
  }
  window.__ganttOnBeforeTaskDisplayId = gantt.attachEvent("onBeforeTaskDisplay", (id, task) => {
    const enabled = Array.from(inputs).filter(inp => inp.checked).map(inp => inp.name);
    if (enabled.length === 0) return false;
    return enabled.some(priority => hasPriority(id, priority));
  });

  wrap.dataset.filtersInited = '1';
};

// Sorting
let p_direction = false, n_direction = false;
function sortByPriority() {
  gantt.sort("priority", p_direction);
  p_direction = !p_direction;
}
function sortByName() {
  gantt.sort("text", n_direction);
  n_direction = !n_direction;
}

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
document.addEventListener("DOMContentLoaded", () => {
  const btnPriority = document.getElementById("sort_priority");
  const btnName = document.getElementById("sort_name");
  if (btnPriority) btnPriority.addEventListener("click", sortByPriority);
  if (btnName) btnName.addEventListener("click", sortByName);

  // Radio sort option handling
  const sortRadios = document.querySelectorAll('input[name="sort_option"]');
  if (sortRadios.length) {
    sortRadios.forEach(r => {
      r.addEventListener('change', e => {
        if (!e.target.checked) return;
        const val = e.target.value;
        if (val === 'priority') { p_direction = false; sortByPriority(); }
        else if (val === 'name') { n_direction = false; sortByName(); }
      });
    });
    const initial = Array.from(sortRadios).find(r => r.checked);
    if (initial) {
      if (initial.value === 'priority') { p_direction = false; sortByPriority(); }
      else if (initial.value === 'name') { n_direction = false; sortByName(); }
    }
  }

  // Column visibility toggles
  const colToggles = document.querySelectorAll('.gantt-col-toggle');
  if (colToggles.length) {
    colToggles.forEach(cb => cb.addEventListener('change', () => applyColumnVisibility()));
    applyColumnVisibility();
  }
});

function applyColumnVisibility() {
  if (!window.gantt || !window.__ganttOriginalColumns) return;
  
  gantt.config.columns = window.__ganttOriginalColumns.filter(col => {
    const toggle = document.querySelector(`.gantt-col-toggle[data-col="${col.name}"]`);
    if (!toggle) return true; // Always show if no toggle exists
    return toggle.checked;
  });
  
  gantt.render();
}

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
