
(function(l, r) { if (!l || l.getElementById('livereloadscript')) return; r = l.createElement('script'); r.async = 1; r.src = '//' + (self.location.host || 'localhost').split(':')[0] + ':35729/livereload.js?snipver=1'; r.id = 'livereloadscript'; l.getElementsByTagName('head')[0].appendChild(r) })(self.document);
var app = (function () {
    'use strict';

    function noop() { }
    function add_location(element, file, line, column, char) {
        element.__svelte_meta = {
            loc: { file, line, column, char }
        };
    }
    function run(fn) {
        return fn();
    }
    function blank_object() {
        return Object.create(null);
    }
    function run_all(fns) {
        fns.forEach(run);
    }
    function is_function(thing) {
        return typeof thing === 'function';
    }
    function safe_not_equal(a, b) {
        return a != a ? b == b : a !== b || ((a && typeof a === 'object') || typeof a === 'function');
    }
    function is_empty(obj) {
        return Object.keys(obj).length === 0;
    }
    function validate_store(store, name) {
        if (store != null && typeof store.subscribe !== 'function') {
            throw new Error(`'${name}' is not a store with a 'subscribe' method`);
        }
    }
    function subscribe(store, ...callbacks) {
        if (store == null) {
            return noop;
        }
        const unsub = store.subscribe(...callbacks);
        return unsub.unsubscribe ? () => unsub.unsubscribe() : unsub;
    }
    function get_store_value(store) {
        let value;
        subscribe(store, _ => value = _)();
        return value;
    }
    function component_subscribe(component, store, callback) {
        component.$$.on_destroy.push(subscribe(store, callback));
    }
    function append(target, node) {
        target.appendChild(node);
    }
    function insert(target, node, anchor) {
        target.insertBefore(node, anchor || null);
    }
    function detach(node) {
        node.parentNode.removeChild(node);
    }
    function destroy_each(iterations, detaching) {
        for (let i = 0; i < iterations.length; i += 1) {
            if (iterations[i])
                iterations[i].d(detaching);
        }
    }
    function element$1(name) {
        return document.createElement(name);
    }
    function text(data) {
        return document.createTextNode(data);
    }
    function space() {
        return text(' ');
    }
    function empty() {
        return text('');
    }
    function listen(node, event, handler, options) {
        node.addEventListener(event, handler, options);
        return () => node.removeEventListener(event, handler, options);
    }
    function attr(node, attribute, value) {
        if (value == null)
            node.removeAttribute(attribute);
        else if (node.getAttribute(attribute) !== value)
            node.setAttribute(attribute, value);
    }
    function children(element) {
        return Array.from(element.childNodes);
    }
    function set_input_value(input, value) {
        input.value = value == null ? '' : value;
    }
    function set_style(node, key, value, important) {
        node.style.setProperty(key, value, important ? 'important' : '');
    }
    function select_option(select, value) {
        for (let i = 0; i < select.options.length; i += 1) {
            const option = select.options[i];
            if (option.__value === value) {
                option.selected = true;
                return;
            }
        }
        select.selectedIndex = -1; // no option should be selected
    }
    function select_value(select) {
        const selected_option = select.querySelector(':checked') || select.options[0];
        return selected_option && selected_option.__value;
    }
    function custom_event(type, detail, bubbles = false) {
        const e = document.createEvent('CustomEvent');
        e.initCustomEvent(type, bubbles, false, detail);
        return e;
    }

    let current_component;
    function set_current_component(component) {
        current_component = component;
    }
    function get_current_component() {
        if (!current_component)
            throw new Error('Function called outside component initialization');
        return current_component;
    }
    function onMount(fn) {
        get_current_component().$$.on_mount.push(fn);
    }

    const dirty_components = [];
    const binding_callbacks = [];
    const render_callbacks = [];
    const flush_callbacks = [];
    const resolved_promise = Promise.resolve();
    let update_scheduled = false;
    function schedule_update() {
        if (!update_scheduled) {
            update_scheduled = true;
            resolved_promise.then(flush);
        }
    }
    function add_render_callback(fn) {
        render_callbacks.push(fn);
    }
    let flushing = false;
    const seen_callbacks = new Set();
    function flush() {
        if (flushing)
            return;
        flushing = true;
        do {
            // first, call beforeUpdate functions
            // and update components
            for (let i = 0; i < dirty_components.length; i += 1) {
                const component = dirty_components[i];
                set_current_component(component);
                update(component.$$);
            }
            set_current_component(null);
            dirty_components.length = 0;
            while (binding_callbacks.length)
                binding_callbacks.pop()();
            // then, once components are updated, call
            // afterUpdate functions. This may cause
            // subsequent updates...
            for (let i = 0; i < render_callbacks.length; i += 1) {
                const callback = render_callbacks[i];
                if (!seen_callbacks.has(callback)) {
                    // ...so guard against infinite loops
                    seen_callbacks.add(callback);
                    callback();
                }
            }
            render_callbacks.length = 0;
        } while (dirty_components.length);
        while (flush_callbacks.length) {
            flush_callbacks.pop()();
        }
        update_scheduled = false;
        flushing = false;
        seen_callbacks.clear();
    }
    function update($$) {
        if ($$.fragment !== null) {
            $$.update();
            run_all($$.before_update);
            const dirty = $$.dirty;
            $$.dirty = [-1];
            $$.fragment && $$.fragment.p($$.ctx, dirty);
            $$.after_update.forEach(add_render_callback);
        }
    }
    const outroing = new Set();
    let outros;
    function transition_in(block, local) {
        if (block && block.i) {
            outroing.delete(block);
            block.i(local);
        }
    }
    function transition_out(block, local, detach, callback) {
        if (block && block.o) {
            if (outroing.has(block))
                return;
            outroing.add(block);
            outros.c.push(() => {
                outroing.delete(block);
                if (callback) {
                    if (detach)
                        block.d(1);
                    callback();
                }
            });
            block.o(local);
        }
    }

    const globals = (typeof window !== 'undefined'
        ? window
        : typeof globalThis !== 'undefined'
            ? globalThis
            : global);
    function create_component(block) {
        block && block.c();
    }
    function mount_component(component, target, anchor, customElement) {
        const { fragment, on_mount, on_destroy, after_update } = component.$$;
        fragment && fragment.m(target, anchor);
        if (!customElement) {
            // onMount happens before the initial afterUpdate
            add_render_callback(() => {
                const new_on_destroy = on_mount.map(run).filter(is_function);
                if (on_destroy) {
                    on_destroy.push(...new_on_destroy);
                }
                else {
                    // Edge case - component was destroyed immediately,
                    // most likely as a result of a binding initialising
                    run_all(new_on_destroy);
                }
                component.$$.on_mount = [];
            });
        }
        after_update.forEach(add_render_callback);
    }
    function destroy_component(component, detaching) {
        const $$ = component.$$;
        if ($$.fragment !== null) {
            run_all($$.on_destroy);
            $$.fragment && $$.fragment.d(detaching);
            // TODO null out other refs, including component.$$ (but need to
            // preserve final state?)
            $$.on_destroy = $$.fragment = null;
            $$.ctx = [];
        }
    }
    function make_dirty(component, i) {
        if (component.$$.dirty[0] === -1) {
            dirty_components.push(component);
            schedule_update();
            component.$$.dirty.fill(0);
        }
        component.$$.dirty[(i / 31) | 0] |= (1 << (i % 31));
    }
    function init(component, options, instance, create_fragment, not_equal, props, append_styles, dirty = [-1]) {
        const parent_component = current_component;
        set_current_component(component);
        const $$ = component.$$ = {
            fragment: null,
            ctx: null,
            // state
            props,
            update: noop,
            not_equal,
            bound: blank_object(),
            // lifecycle
            on_mount: [],
            on_destroy: [],
            on_disconnect: [],
            before_update: [],
            after_update: [],
            context: new Map(parent_component ? parent_component.$$.context : options.context || []),
            // everything else
            callbacks: blank_object(),
            dirty,
            skip_bound: false,
            root: options.target || parent_component.$$.root
        };
        append_styles && append_styles($$.root);
        let ready = false;
        $$.ctx = instance
            ? instance(component, options.props || {}, (i, ret, ...rest) => {
                const value = rest.length ? rest[0] : ret;
                if ($$.ctx && not_equal($$.ctx[i], $$.ctx[i] = value)) {
                    if (!$$.skip_bound && $$.bound[i])
                        $$.bound[i](value);
                    if (ready)
                        make_dirty(component, i);
                }
                return ret;
            })
            : [];
        $$.update();
        ready = true;
        run_all($$.before_update);
        // `false` as a special case of no DOM component
        $$.fragment = create_fragment ? create_fragment($$.ctx) : false;
        if (options.target) {
            if (options.hydrate) {
                const nodes = children(options.target);
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.l(nodes);
                nodes.forEach(detach);
            }
            else {
                // eslint-disable-next-line @typescript-eslint/no-non-null-assertion
                $$.fragment && $$.fragment.c();
            }
            if (options.intro)
                transition_in(component.$$.fragment);
            mount_component(component, options.target, options.anchor, options.customElement);
            flush();
        }
        set_current_component(parent_component);
    }
    /**
     * Base class for Svelte components. Used when dev=false.
     */
    class SvelteComponent {
        $destroy() {
            destroy_component(this, 1);
            this.$destroy = noop;
        }
        $on(type, callback) {
            const callbacks = (this.$$.callbacks[type] || (this.$$.callbacks[type] = []));
            callbacks.push(callback);
            return () => {
                const index = callbacks.indexOf(callback);
                if (index !== -1)
                    callbacks.splice(index, 1);
            };
        }
        $set($$props) {
            if (this.$$set && !is_empty($$props)) {
                this.$$.skip_bound = true;
                this.$$set($$props);
                this.$$.skip_bound = false;
            }
        }
    }

    function dispatch_dev(type, detail) {
        document.dispatchEvent(custom_event(type, Object.assign({ version: '3.42.4' }, detail), true));
    }
    function append_dev(target, node) {
        dispatch_dev('SvelteDOMInsert', { target, node });
        append(target, node);
    }
    function insert_dev(target, node, anchor) {
        dispatch_dev('SvelteDOMInsert', { target, node, anchor });
        insert(target, node, anchor);
    }
    function detach_dev(node) {
        dispatch_dev('SvelteDOMRemove', { node });
        detach(node);
    }
    function listen_dev(node, event, handler, options, has_prevent_default, has_stop_propagation) {
        const modifiers = options === true ? ['capture'] : options ? Array.from(Object.keys(options)) : [];
        if (has_prevent_default)
            modifiers.push('preventDefault');
        if (has_stop_propagation)
            modifiers.push('stopPropagation');
        dispatch_dev('SvelteDOMAddEventListener', { node, event, handler, modifiers });
        const dispose = listen(node, event, handler, options);
        return () => {
            dispatch_dev('SvelteDOMRemoveEventListener', { node, event, handler, modifiers });
            dispose();
        };
    }
    function attr_dev(node, attribute, value) {
        attr(node, attribute, value);
        if (value == null)
            dispatch_dev('SvelteDOMRemoveAttribute', { node, attribute });
        else
            dispatch_dev('SvelteDOMSetAttribute', { node, attribute, value });
    }
    function prop_dev(node, property, value) {
        node[property] = value;
        dispatch_dev('SvelteDOMSetProperty', { node, property, value });
    }
    function set_data_dev(text, data) {
        data = '' + data;
        if (text.wholeText === data)
            return;
        dispatch_dev('SvelteDOMSetData', { node: text, data });
        text.data = data;
    }
    function validate_each_argument(arg) {
        if (typeof arg !== 'string' && !(arg && typeof arg === 'object' && 'length' in arg)) {
            let msg = '{#each} only iterates over array-like objects.';
            if (typeof Symbol === 'function' && arg && Symbol.iterator in arg) {
                msg += ' You can use a spread to convert this iterable into an array.';
            }
            throw new Error(msg);
        }
    }
    function validate_slots(name, slot, keys) {
        for (const slot_key of Object.keys(slot)) {
            if (!~keys.indexOf(slot_key)) {
                console.warn(`<${name}> received an unexpected slot "${slot_key}".`);
            }
        }
    }
    /**
     * Base class for Svelte components with some minor dev-enhancements. Used when dev=true.
     */
    class SvelteComponentDev extends SvelteComponent {
        constructor(options) {
            if (!options || (!options.target && !options.$$inline)) {
                throw new Error("'target' is a required option");
            }
            super();
        }
        $destroy() {
            super.$destroy();
            this.$destroy = () => {
                console.warn('Component was already destroyed'); // eslint-disable-line no-console
            };
        }
        $capture_state() { }
        $inject_state() { }
    }

    const subscriber_queue = [];
    /**
     * Create a `Writable` store that allows both updating and reading by subscription.
     * @param {*=}value initial value
     * @param {StartStopNotifier=}start start and stop notifications for subscriptions
     */
    function writable(value, start = noop) {
        let stop;
        const subscribers = new Set();
        function set(new_value) {
            if (safe_not_equal(value, new_value)) {
                value = new_value;
                if (stop) { // store is ready
                    const run_queue = !subscriber_queue.length;
                    for (const subscriber of subscribers) {
                        subscriber[1]();
                        subscriber_queue.push(subscriber, value);
                    }
                    if (run_queue) {
                        for (let i = 0; i < subscriber_queue.length; i += 2) {
                            subscriber_queue[i][0](subscriber_queue[i + 1]);
                        }
                        subscriber_queue.length = 0;
                    }
                }
            }
        }
        function update(fn) {
            set(fn(value));
        }
        function subscribe(run, invalidate = noop) {
            const subscriber = [run, invalidate];
            subscribers.add(subscriber);
            if (subscribers.size === 1) {
                stop = start(set) || noop;
            }
            run(value);
            return () => {
                subscribers.delete(subscriber);
                if (subscribers.size === 0) {
                    stop();
                    stop = null;
                }
            };
        }
        return { set, update, subscribe };
    }

    const toRender = writable("");
    const toCopy = writable("");
    const element = writable("marketingblock");

    const elementRef = () => { return get_store_value(element); };
    function _render(obj, isTest) {
        switch (elementRef()) {
            //Marketingblock
            case "marketingblock": {
                const img = `${obj.picture.value}?format=auto&f=380x380&quality=80`; //add size & quality tags
                let url = obj.href.value;
                if (isTest) {
                    url = `https://www.decathlon.hu${obj.href.value}`;
                }
                const type = () => {
                    switch (obj.variant.value) {
                        case "white":
                            return "";
                        case "black":
                            return "black";
                        case "sales":
                            return "sales";
                    }
                };
                return `
        <script>  
          const stylesheet = document.querySelector('link[href="/static/css/marketingblocks.css"]');  
          if (!stylesheet) {
            const link = document.createElement('link');
            link.href = '/static/css/marketingblocks.css';
            link.rel = 'stylesheet';
            link.type = 'text/css';
            document.head.appendChild(link);
          }
        </script>
        <a class="mb ${type()}" ${obj.newtab.value ? 'target="_blank"' : ''} href="${url}" onclick='
              let url = window.location.href; 
              let mbLocation = url.replace(/.*\/(c[A-Za-z0-9-]+)\/.*?\/_.*$/, "$1");
              ga("transcript.send",  {
                  hitType: "event",
                  eventCategory: "ProductListing",
                  eventAction: "Marketingblock",
                  eventLabel: \${'${obj.eventlabel.value}' + "_" + "mbLocation"}
            });
          '>
        <img src="${img}" alt="choose a background">
        <div class="mb-overlay"></div>
        <span class="mb-title">${obj.title.value}</span>
        <button class="vtmn-btn vtmn-btn_variant--secondary-reversed" type="button">${obj.buttontext.value}<span
            class="material-icons">${obj.newtab.value ? 'open_in_new' : 'chevron_right'}</span></button>
        </a>
      `;
            }
            //Main Promo
            case "mainpromo": {
                const img = `${obj.picture.value}?format=auto&f=800x600&quality=80`; //add size & quality tags
                return isTest ?
                    `<img loading="eager" src="${img}" alt="choose a background">
        <span class="overlay"></span>
        <span data-display="no" class="price">1000 Ft-tól</span>
        <div data-sport="futas" class="badge">${obj.badge.value}</div>
        <div class="category">${obj.title.value}</div>
        <div class="ctaa">Megnézem<span class="material-icons">chevron_right</span></div>
        `
                    :
                        `
        <a onclick="ga('transcript.send', 'event', 'Homepage', 'MainPromo', '${obj.eventlabel.value}');" href="${obj.href.value}" class="promo-block">
        <img loading="eager" src="${img}" alt="">
        <span class="overlay"></span>
        <span data-display="no" class="price">1000 Ft-tól</span>
        <div data-sport="futas" class="badge">${obj.badge.value}</div>
        <div class="category">${obj.title.value}</div>
        <div class="ctaa">Megnézem<span class="material-icons">chevron_right</span></div>
        </a>
        `;
            }
            //Secondary Promo
            case "secondarypromo": {
                const img = `${obj.picture.value}?format=auto&f=400x300&quality=80`; //add size & quality tags
                return isTest ?
                    `          
        <span class="overlay"></span>
        <img loading="eager" id="block3" data-position="auto" src="${img}" alt="choose a background">
        <span data-display="no" class="price">1000 Ft-tól</span>
        <div class="badge">${obj.badge.value}</div>
        <div class="category">${obj.title.value}</div>
        `
                    :
                        `
          <a loading="eager" href=${obj.href.value} onclick="ga('transcript.send', 'event', 'Homepage', 'SecondaryPromo', '${obj.eventlabel.value}');" class="block">
           <span class="overlay"></span>
            <img loading="eager" id="block3" data-position="auto" src="${img}" alt="">
            <span data-display="no" class="price">1000 Ft-tól</span>
            <div class="badge">${obj.badge.value}</div>
            <div class="category">${obj.title.value}</div>
          </a>
        `;
            }
            default:
                return "default";
        }
    }

    /* src\Input.svelte generated by Svelte v3.42.4 */

    const { Object: Object_1, console: console_1 } = globals;
    const file$2 = "src\\Input.svelte";

    function get_each_context$1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[16] = list[i];
    	child_ctx[17] = list;
    	child_ctx[18] = i;
    	return child_ctx;
    }

    function get_each_context_1(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[19] = list[i].name;
    	child_ctx[20] = list[i].value;
    	return child_ctx;
    }

    // (189:4) {:else}
    function create_else_block(ctx) {
    	let input_1;
    	let input_1_id_value;
    	let t0;
    	let span;
    	let mounted;
    	let dispose;

    	function input_1_input_handler() {
    		/*input_1_input_handler*/ ctx[10].call(input_1, /*i*/ ctx[18]);
    	}

    	function click_handler() {
    		return /*click_handler*/ ctx[11](/*field*/ ctx[16]);
    	}

    	const block = {
    		c: function create() {
    			input_1 = element$1("input");
    			t0 = space();
    			span = element$1("span");
    			span.textContent = "clear";
    			attr_dev(input_1, "type", "text");
    			attr_dev(input_1, "id", input_1_id_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]]);
    			attr_dev(input_1, "class", "svelte-43wfsl");
    			add_location(input_1, file$2, 189, 4, 4936);
    			attr_dev(span, "class", "material-icons clearbtn svelte-43wfsl");
    			add_location(span, file$2, 190, 4, 5032);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			set_input_value(input_1, /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value);
    			insert_dev(target, t0, anchor);
    			insert_dev(target, span, anchor);

    			if (!mounted) {
    				dispose = [
    					listen_dev(input_1, "input", input_1_input_handler),
    					listen_dev(span, "click", click_handler, false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*inputFields, input, $element*/ 7 && input_1_id_value !== (input_1_id_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]])) {
    				attr_dev(input_1, "id", input_1_id_value);
    			}

    			if (dirty & /*input, $element, inputFields*/ 7 && input_1.value !== /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value) {
    				set_input_value(input_1, /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			if (detaching) detach_dev(t0);
    			if (detaching) detach_dev(span);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_else_block.name,
    		type: "else",
    		source: "(189:4) {:else}",
    		ctx
    	});

    	return block;
    }

    // (187:123) 
    function create_if_block_1$1(ctx) {
    	let input_1;
    	let input_1_id_value;
    	let mounted;
    	let dispose;

    	function input_1_change_handler() {
    		/*input_1_change_handler*/ ctx[9].call(input_1, /*i*/ ctx[18]);
    	}

    	const block = {
    		c: function create() {
    			input_1 = element$1("input");
    			attr_dev(input_1, "type", "checkbox");
    			attr_dev(input_1, "id", input_1_id_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]]);
    			attr_dev(input_1, "class", "svelte-43wfsl");
    			add_location(input_1, file$2, 187, 4, 4823);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, input_1, anchor);
    			set_input_value(input_1, /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value);

    			if (!mounted) {
    				dispose = listen_dev(input_1, "change", input_1_change_handler);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*inputFields, input, $element*/ 7 && input_1_id_value !== (input_1_id_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]])) {
    				attr_dev(input_1, "id", input_1_id_value);
    			}

    			if (dirty & /*input, $element, inputFields*/ 7) {
    				set_input_value(input_1, /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(input_1);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1$1.name,
    		type: "if",
    		source: "(187:123) ",
    		ctx
    	});

    	return block;
    }

    // (180:4) {#if input[$element][inputFields[i]].type === 'select'}
    function create_if_block$1(ctx) {
    	let select;
    	let select_id_value;
    	let mounted;
    	let dispose;
    	let each_value_1 = /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].options;
    	validate_each_argument(each_value_1);
    	let each_blocks = [];

    	for (let i = 0; i < each_value_1.length; i += 1) {
    		each_blocks[i] = create_each_block_1(get_each_context_1(ctx, each_value_1, i));
    	}

    	function select_change_handler_1() {
    		/*select_change_handler_1*/ ctx[8].call(select, /*i*/ ctx[18]);
    	}

    	const block = {
    		c: function create() {
    			select = element$1("select");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(select, "id", select_id_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]]);
    			attr_dev(select, "name", "type");
    			attr_dev(select, "class", "svelte-43wfsl");
    			if (/*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value === void 0) add_render_callback(select_change_handler_1);
    			add_location(select, file$2, 180, 6, 4442);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, select, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(select, null);
    			}

    			select_option(select, /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value);

    			if (!mounted) {
    				dispose = listen_dev(select, "change", select_change_handler_1);
    				mounted = true;
    			}
    		},
    		p: function update(new_ctx, dirty) {
    			ctx = new_ctx;

    			if (dirty & /*input, $element, inputFields*/ 7) {
    				each_value_1 = /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].options;
    				validate_each_argument(each_value_1);
    				let i;

    				for (i = 0; i < each_value_1.length; i += 1) {
    					const child_ctx = get_each_context_1(ctx, each_value_1, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block_1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(select, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value_1.length;
    			}

    			if (dirty & /*inputFields, input, $element*/ 7 && select_id_value !== (select_id_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]])) {
    				attr_dev(select, "id", select_id_value);
    			}

    			if (dirty & /*input, $element, inputFields*/ 7) {
    				select_option(select, /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].value);
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(select);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			dispose();
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block$1.name,
    		type: "if",
    		source: "(180:4) {#if input[$element][inputFields[i]].type === 'select'}",
    		ctx
    	});

    	return block;
    }

    // (182:8) {#each input[$element][inputFields[i]].options as {name, value}}
    function create_each_block_1(ctx) {
    	let option;
    	let t_value = /*name*/ ctx[19] + "";
    	let t;
    	let option_value_value;

    	const block = {
    		c: function create() {
    			option = element$1("option");
    			t = text(t_value);
    			option.__value = option_value_value = /*value*/ ctx[20];
    			option.value = option.__value;
    			add_location(option, file$2, 182, 10, 4619);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, option, anchor);
    			append_dev(option, t);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*input, $element, inputFields*/ 7 && t_value !== (t_value = /*name*/ ctx[19] + "")) set_data_dev(t, t_value);

    			if (dirty & /*input, $element, inputFields*/ 7 && option_value_value !== (option_value_value = /*value*/ ctx[20])) {
    				prop_dev(option, "__value", option_value_value);
    				option.value = option.__value;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(option);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block_1.name,
    		type: "each",
    		source: "(182:8) {#each input[$element][inputFields[i]].options as {name, value}}",
    		ctx
    	});

    	return block;
    }

    // (175:2) {#each inputFields as field,i}
    function create_each_block$1(ctx) {
    	let label;
    	let t0_value = /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].name + "";
    	let t0;
    	let label_for_value;
    	let t1;
    	let if_block_anchor;

    	function select_block_type(ctx, dirty) {
    		if (/*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].type === 'select') return create_if_block$1;
    		if (/*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].type === 'input' && /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].inputType === 'checkbox') return create_if_block_1$1;
    		return create_else_block;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type(ctx);

    	const block = {
    		c: function create() {
    			label = element$1("label");
    			t0 = text(t0_value);
    			t1 = space();
    			if_block.c();
    			if_block_anchor = empty();
    			attr_dev(label, "for", label_for_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]]);
    			attr_dev(label, "class", "svelte-43wfsl");
    			add_location(label, file$2, 175, 4, 4283);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, label, anchor);
    			append_dev(label, t0);
    			insert_dev(target, t1, anchor);
    			if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*input, $element, inputFields*/ 7 && t0_value !== (t0_value = /*input*/ ctx[0][/*$element*/ ctx[1]][/*inputFields*/ ctx[2][/*i*/ ctx[18]]].name + "")) set_data_dev(t0, t0_value);

    			if (dirty & /*inputFields, input, $element*/ 7 && label_for_value !== (label_for_value = /*inputFields*/ ctx[2][/*i*/ ctx[18]])) {
    				attr_dev(label, "for", label_for_value);
    			}

    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if_block.d(1);
    				if_block = current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(label);
    			if (detaching) detach_dev(t1);
    			if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block$1.name,
    		type: "each",
    		source: "(175:2) {#each inputFields as field,i}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$2(ctx) {
    	let div1;
    	let label;
    	let t1;
    	let select;
    	let option0;
    	let option1;
    	let option2;
    	let t5;
    	let t6;
    	let div0;
    	let button0;
    	let span0;
    	let t8;
    	let t9;
    	let button1;
    	let span1;
    	let t11;
    	let mounted;
    	let dispose;
    	let each_value = /*inputFields*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block$1(get_each_context$1(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			div1 = element$1("div");
    			label = element$1("label");
    			label.textContent = "Element type";
    			t1 = space();
    			select = element$1("select");
    			option0 = element$1("option");
    			option0.textContent = "Main promo";
    			option1 = element$1("option");
    			option1.textContent = "Secondary promo";
    			option2 = element$1("option");
    			option2.textContent = "Marketingblock";
    			t5 = space();

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			t6 = space();
    			div0 = element$1("div");
    			button0 = element$1("button");
    			span0 = element$1("span");
    			span0.textContent = "restart_alt";
    			t8 = text("\r\n      Reset");
    			t9 = space();
    			button1 = element$1("button");
    			span1 = element$1("span");
    			span1.textContent = "content_copy";
    			t11 = text("\r\n      Copy");
    			attr_dev(label, "for", "type");
    			attr_dev(label, "class", "svelte-43wfsl");
    			add_location(label, file$2, 165, 2, 3952);
    			option0.__value = "mainpromo";
    			option0.value = option0.__value;
    			add_location(option0, file$2, 169, 4, 4062);
    			option1.__value = "secondarypromo";
    			option1.value = option1.__value;
    			add_location(option1, file$2, 170, 4, 4113);
    			option2.__value = "marketingblock";
    			option2.value = option2.__value;
    			add_location(option2, file$2, 171, 4, 4174);
    			attr_dev(select, "id", "type");
    			attr_dev(select, "name", "type");
    			attr_dev(select, "class", "svelte-43wfsl");
    			if (/*$element*/ ctx[1] === void 0) add_render_callback(() => /*select_change_handler*/ ctx[7].call(select));
    			add_location(select, file$2, 168, 2, 4004);
    			attr_dev(span0, "class", "material-icons");
    			add_location(span0, file$2, 201, 6, 5294);
    			attr_dev(button0, "class", "vtmn-btn vtmn-btn_variant--secondary");
    			add_location(button0, file$2, 200, 4, 5202);
    			attr_dev(span1, "class", "material-icons");
    			add_location(span1, file$2, 207, 6, 5520);
    			attr_dev(button1, "class", "vtmn-btn vtmn-btn_variant--primary");
    			button1.disabled = /*isDisabled*/ ctx[5]();
    			add_location(button1, file$2, 206, 4, 5393);
    			attr_dev(div0, "class", "button-wrapper svelte-43wfsl");
    			add_location(div0, file$2, 199, 2, 5168);
    			attr_dev(div1, "class", "input-wrapper svelte-43wfsl");
    			add_location(div1, file$2, 164, 0, 3921);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, label);
    			append_dev(div1, t1);
    			append_dev(div1, select);
    			append_dev(select, option0);
    			append_dev(select, option1);
    			append_dev(select, option2);
    			select_option(select, /*$element*/ ctx[1]);
    			append_dev(div1, t5);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(div1, null);
    			}

    			append_dev(div1, t6);
    			append_dev(div1, div0);
    			append_dev(div0, button0);
    			append_dev(button0, span0);
    			append_dev(button0, t8);
    			append_dev(div0, t9);
    			append_dev(div0, button1);
    			append_dev(button1, span1);
    			append_dev(button1, t11);

    			if (!mounted) {
    				dispose = [
    					listen_dev(select, "change", /*select_change_handler*/ ctx[7]),
    					listen_dev(button0, "click", /*click_handler_1*/ ctx[12], false, false, false),
    					listen_dev(button1, "click", /*click_handler_2*/ ctx[13], false, false, false)
    				];

    				mounted = true;
    			}
    		},
    		p: function update(ctx, [dirty]) {
    			if (dirty & /*$element*/ 2) {
    				select_option(select, /*$element*/ ctx[1]);
    			}

    			if (dirty & /*inputFields, input, $element, clearInput*/ 71) {
    				each_value = /*inputFields*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context$1(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block$1(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(div1, t6);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    			destroy_each(each_blocks, detaching);
    			mounted = false;
    			run_all(dispose);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$2.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance$2($$self, $$props, $$invalidate) {
    	let inputFields;
    	let $element;
    	let $toCopy;
    	validate_store(element, 'element');
    	component_subscribe($$self, element, $$value => $$invalidate(1, $element = $$value));
    	validate_store(toCopy, 'toCopy');
    	component_subscribe($$self, toCopy, $$value => $$invalidate(14, $toCopy = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('Input', slots, []);
    	let _element = "marketingblock";
    	

    	let input = {
    		//Marketingblock
    		marketingblock: {
    			title: { name: 'Title', value: '', type: 'input' },
    			buttontext: {
    				name: 'Button text',
    				value: '',
    				type: 'input'
    			},
    			href: { name: 'Link', value: '', type: 'input' },
    			picture: {
    				name: 'Background',
    				value: '',
    				type: 'input'
    			},
    			variant: {
    				name: 'Variant',
    				value: 'white',
    				type: 'select',
    				options: [
    					{ name: "White", value: "white" },
    					{ name: "Black", value: "black" },
    					{ name: "Sales", value: "sales" }
    				]
    			},
    			eventlabel: {
    				name: 'Event label',
    				value: '',
    				type: 'input'
    			},
    			newtab: {
    				name: 'Open in new tab',
    				value: false,
    				type: 'input',
    				inputType: 'checkbox'
    			}
    		},
    		//Main promo
    		mainpromo: {
    			title: {
    				name: 'Category',
    				value: '',
    				type: 'input'
    			},
    			badge: { name: 'Badge', value: '', type: 'input' },
    			href: { name: 'Link', value: '', type: 'input' },
    			picture: {
    				name: 'Background',
    				value: '',
    				type: 'input'
    			},
    			eventlabel: {
    				name: 'Event label',
    				value: '',
    				type: 'input'
    			}
    		},
    		//Secondary promo
    		secondarypromo: {
    			title: {
    				name: 'Category',
    				value: '',
    				type: 'input'
    			},
    			badge: { name: 'Badge', value: '', type: 'input' },
    			href: { name: 'Link', value: '', type: 'input' },
    			picture: {
    				name: 'Background',
    				value: '',
    				type: 'input'
    			},
    			eventlabel: {
    				name: 'Event label',
    				value: '',
    				type: 'input'
    			}
    		}
    	};

    	//HELPERS
    	function copyToClipboard() {
    		navigator.clipboard.writeText($toCopy);
    	}

    	

    	function resetInput() {
    		Object.keys(input[$element]).forEach(e => {
    			const type = typeof input[$element][e].value;
    			console.log(type);

    			if (input[$element][e].value === "") {
    				return;
    			} else if (input[$element][e].type === "select") {
    				$$invalidate(0, input[$element][e].value = input[$element][e].options[0].value, input);
    			} else if (type === "string") {
    				$$invalidate(0, input[$element][e].value = "", input);
    			} else if (type === "boolean") {
    				$$invalidate(0, input[$element][e].value = false, input);
    			}
    		});
    	}

    	

    	//disable copy if not everything is filled
    	function isDisabled() {
    		return Object.keys(input[$element]).some(e => input[$element][e].value === "");
    	}

    	

    	function clearInput(field) {
    		$$invalidate(0, input[$element][field].value = "", input);
    	}

    	const writable_props = [];

    	Object_1.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console_1.warn(`<Input> was created with unknown prop '${key}'`);
    	});

    	function select_change_handler() {
    		$element = select_value(this);
    		element.set($element);
    	}

    	function select_change_handler_1(i) {
    		input[$element][inputFields[i]].value = select_value(this);
    		$$invalidate(0, input);
    		(($$invalidate(2, inputFields), $$invalidate(0, input)), $$invalidate(1, $element));
    	}

    	function input_1_change_handler(i) {
    		input[$element][inputFields[i]].value = this.value;
    		$$invalidate(0, input);
    		(($$invalidate(2, inputFields), $$invalidate(0, input)), $$invalidate(1, $element));
    	}

    	function input_1_input_handler(i) {
    		input[$element][inputFields[i]].value = this.value;
    		$$invalidate(0, input);
    		(($$invalidate(2, inputFields), $$invalidate(0, input)), $$invalidate(1, $element));
    	}

    	const click_handler = field => clearInput(field);
    	const click_handler_1 = () => resetInput();
    	const click_handler_2 = () => copyToClipboard();

    	$$self.$capture_state = () => ({
    		_render,
    		toRender,
    		toCopy,
    		element,
    		_element,
    		input,
    		copyToClipboard,
    		resetInput,
    		isDisabled,
    		clearInput,
    		inputFields,
    		$element,
    		$toCopy
    	});

    	$$self.$inject_state = $$props => {
    		if ('_element' in $$props) $$invalidate(15, _element = $$props._element);
    		if ('input' in $$props) $$invalidate(0, input = $$props.input);
    		if ('inputFields' in $$props) $$invalidate(2, inputFields = $$props.inputFields);
    	};

    	if ($$props && "$$inject" in $$props) {
    		$$self.$inject_state($$props.$$inject);
    	}

    	$$self.$$.update = () => {
    		if ($$self.$$.dirty & /*input, $element*/ 3) {
    			$$invalidate(2, inputFields = Object.keys(input[$element]));
    		}

    		if ($$self.$$.dirty & /*input, $element*/ 3) {
    			{
    				function render() {
    					//render mb
    					toRender.set(_render(input[$element], true));

    					toCopy.set(_render(input[$element], false));
    				}

    				
    				render();
    			}
    		}
    	};

    	{
    		element.set(_element);
    	}

    	return [
    		input,
    		$element,
    		inputFields,
    		copyToClipboard,
    		resetInput,
    		isDisabled,
    		clearInput,
    		select_change_handler,
    		select_change_handler_1,
    		input_1_change_handler,
    		input_1_input_handler,
    		click_handler,
    		click_handler_1,
    		click_handler_2
    	];
    }

    class Input extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$2, create_fragment$2, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "Input",
    			options,
    			id: create_fragment$2.name
    		});
    	}
    }

    /* src\PreviewBlocks.svelte generated by Svelte v3.42.4 */
    const file$1 = "src\\PreviewBlocks.svelte";

    function get_each_context(ctx, list, i) {
    	const child_ctx = ctx.slice();
    	child_ctx[3] = list[i];
    	return child_ctx;
    }

    // (182:0) {#if $toRender !== ""}
    function create_if_block(ctx) {
    	let ul;
    	let each_value = /*blocks*/ ctx[2];
    	validate_each_argument(each_value);
    	let each_blocks = [];

    	for (let i = 0; i < each_value.length; i += 1) {
    		each_blocks[i] = create_each_block(get_each_context(ctx, each_value, i));
    	}

    	const block = {
    		c: function create() {
    			ul = element$1("ul");

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].c();
    			}

    			attr_dev(ul, "class", "block-list svelte-vs891t");
    			add_location(ul, file$1, 183, 0, 4147);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, ul, anchor);

    			for (let i = 0; i < each_blocks.length; i += 1) {
    				each_blocks[i].m(ul, null);
    			}
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*blocks, $element, $toRender, checkPromoWidth*/ 7) {
    				each_value = /*blocks*/ ctx[2];
    				validate_each_argument(each_value);
    				let i;

    				for (i = 0; i < each_value.length; i += 1) {
    					const child_ctx = get_each_context(ctx, each_value, i);

    					if (each_blocks[i]) {
    						each_blocks[i].p(child_ctx, dirty);
    					} else {
    						each_blocks[i] = create_each_block(child_ctx);
    						each_blocks[i].c();
    						each_blocks[i].m(ul, null);
    					}
    				}

    				for (; i < each_blocks.length; i += 1) {
    					each_blocks[i].d(1);
    				}

    				each_blocks.length = each_value.length;
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(ul);
    			destroy_each(each_blocks, detaching);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block.name,
    		type: "if",
    		source: "(182:0) {#if $toRender !== \\\"\\\"}",
    		ctx
    	});

    	return block;
    }

    // (203:46) 
    function create_if_block_3(ctx) {
    	let div1;
    	let div0;

    	const block = {
    		c: function create() {
    			div1 = element$1("div");
    			div0 = element$1("div");
    			attr_dev(div0, "class", "block");
    			set_style(div0, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			set_style(div0, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			add_location(div0, file$1, 204, 8, 5134);
    			attr_dev(div1, "class", "blocks-container " + checkPromoWidth(/*block*/ ctx[3]));
    			set_style(div1, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			set_style(div1, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			add_location(div1, file$1, 203, 6, 4992);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div1, anchor);
    			append_dev(div1, div0);
    			div0.innerHTML = /*$toRender*/ ctx[0];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$toRender*/ 1) div0.innerHTML = /*$toRender*/ ctx[0];
    			if (dirty & /*$element*/ 2) {
    				set_style(div0, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			}

    			if (dirty & /*$element*/ 2) {
    				set_style(div0, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			}

    			if (dirty & /*$element*/ 2) {
    				set_style(div1, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			}

    			if (dirty & /*$element*/ 2) {
    				set_style(div1, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div1);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_3.name,
    		type: "if",
    		source: "(203:46) ",
    		ctx
    	});

    	return block;
    }

    // (194:41) 
    function create_if_block_2(ctx) {
    	let div2;
    	let div1;
    	let div0;
    	let div0_class_value;

    	const block = {
    		c: function create() {
    			div2 = element$1("div");
    			div1 = element$1("div");
    			div0 = element$1("div");

    			attr_dev(div0, "class", div0_class_value = "promo-block " + (/*block*/ ctx[3][/*$element*/ ctx[1]].width < 600
    			? 'force-mobile'
    			: ''));

    			set_style(div0, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			set_style(div0, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			add_location(div0, file$1, 196, 10, 4699);
    			attr_dev(div1, "class", "promo-container");
    			add_location(div1, file$1, 195, 8, 4658);
    			attr_dev(div2, "class", "promo-wrapper " + checkPromoWidth(/*block*/ ctx[3]));
    			add_location(div2, file$1, 194, 6, 4596);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div2, anchor);
    			append_dev(div2, div1);
    			append_dev(div1, div0);
    			div0.innerHTML = /*$toRender*/ ctx[0];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$toRender*/ 1) div0.innerHTML = /*$toRender*/ ctx[0];
    			if (dirty & /*$element*/ 2 && div0_class_value !== (div0_class_value = "promo-block " + (/*block*/ ctx[3][/*$element*/ ctx[1]].width < 600
    			? 'force-mobile'
    			: ''))) {
    				attr_dev(div0, "class", div0_class_value);
    			}

    			if (dirty & /*$element*/ 2) {
    				set_style(div0, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			}

    			if (dirty & /*$element*/ 2) {
    				set_style(div0, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div2);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_2.name,
    		type: "if",
    		source: "(194:41) ",
    		ctx
    	});

    	return block;
    }

    // (189:6) {#if $element === "marketingblock"}
    function create_if_block_1(ctx) {
    	let div;
    	let div_class_value;

    	const block = {
    		c: function create() {
    			div = element$1("div");

    			attr_dev(div, "class", div_class_value = "block-wrapper " + (/*block*/ ctx[3][/*$element*/ ctx[1]].width < 600
    			? 'force-mobile'
    			: ''));

    			set_style(div, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			set_style(div, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			add_location(div, file$1, 189, 6, 4346);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, div, anchor);
    			div.innerHTML = /*$toRender*/ ctx[0];
    		},
    		p: function update(ctx, dirty) {
    			if (dirty & /*$toRender*/ 1) div.innerHTML = /*$toRender*/ ctx[0];
    			if (dirty & /*$element*/ 2 && div_class_value !== (div_class_value = "block-wrapper " + (/*block*/ ctx[3][/*$element*/ ctx[1]].width < 600
    			? 'force-mobile'
    			: ''))) {
    				attr_dev(div, "class", div_class_value);
    			}

    			if (dirty & /*$element*/ 2) {
    				set_style(div, "width", /*block*/ ctx[3][/*$element*/ ctx[1]].width + "px");
    			}

    			if (dirty & /*$element*/ 2) {
    				set_style(div, "height", /*block*/ ctx[3][/*$element*/ ctx[1]].height + "px");
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(div);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_if_block_1.name,
    		type: "if",
    		source: "(189:6) {#if $element === \\\"marketingblock\\\"}",
    		ctx
    	});

    	return block;
    }

    // (185:2) {#each blocks as block}
    function create_each_block(ctx) {
    	let li;
    	let h3;
    	let t0_value = /*block*/ ctx[3].deviceName + "";
    	let t0;
    	let t1;
    	let h4;
    	let t2;
    	let t3_value = /*block*/ ctx[3].screenRes + "";
    	let t3;
    	let t4;
    	let t5;

    	function select_block_type(ctx, dirty) {
    		if (/*$element*/ ctx[1] === "marketingblock") return create_if_block_1;
    		if (/*$element*/ ctx[1] === "mainpromo") return create_if_block_2;
    		if (/*$element*/ ctx[1] === "secondarypromo") return create_if_block_3;
    	}

    	let current_block_type = select_block_type(ctx);
    	let if_block = current_block_type && current_block_type(ctx);

    	const block = {
    		c: function create() {
    			li = element$1("li");
    			h3 = element$1("h3");
    			t0 = text(t0_value);
    			t1 = space();
    			h4 = element$1("h4");
    			t2 = text("Screen resolution: ");
    			t3 = text(t3_value);
    			t4 = space();
    			if (if_block) if_block.c();
    			t5 = space();
    			attr_dev(h3, "class", "svelte-vs891t");
    			add_location(h3, file$1, 186, 6, 4215);
    			attr_dev(h4, "class", "svelte-vs891t");
    			add_location(h4, file$1, 187, 6, 4250);
    			attr_dev(li, "class", "svelte-vs891t");
    			add_location(li, file$1, 185, 4, 4203);
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, li, anchor);
    			append_dev(li, h3);
    			append_dev(h3, t0);
    			append_dev(li, t1);
    			append_dev(li, h4);
    			append_dev(h4, t2);
    			append_dev(h4, t3);
    			append_dev(li, t4);
    			if (if_block) if_block.m(li, null);
    			append_dev(li, t5);
    		},
    		p: function update(ctx, dirty) {
    			if (current_block_type === (current_block_type = select_block_type(ctx)) && if_block) {
    				if_block.p(ctx, dirty);
    			} else {
    				if (if_block) if_block.d(1);
    				if_block = current_block_type && current_block_type(ctx);

    				if (if_block) {
    					if_block.c();
    					if_block.m(li, t5);
    				}
    			}
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(li);

    			if (if_block) {
    				if_block.d();
    			}
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_each_block.name,
    		type: "each",
    		source: "(185:2) {#each blocks as block}",
    		ctx
    	});

    	return block;
    }

    function create_fragment$1(ctx) {
    	let if_block_anchor;
    	let if_block = /*$toRender*/ ctx[0] !== "" && create_if_block(ctx);

    	const block = {
    		c: function create() {
    			if (if_block) if_block.c();
    			if_block_anchor = empty();
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			if (if_block) if_block.m(target, anchor);
    			insert_dev(target, if_block_anchor, anchor);
    		},
    		p: function update(ctx, [dirty]) {
    			if (/*$toRender*/ ctx[0] !== "") {
    				if (if_block) {
    					if_block.p(ctx, dirty);
    				} else {
    					if_block = create_if_block(ctx);
    					if_block.c();
    					if_block.m(if_block_anchor.parentNode, if_block_anchor);
    				}
    			} else if (if_block) {
    				if_block.d(1);
    				if_block = null;
    			}
    		},
    		i: noop,
    		o: noop,
    		d: function destroy(detaching) {
    			if (if_block) if_block.d(detaching);
    			if (detaching) detach_dev(if_block_anchor);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment$1.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function checkPromoWidth(block) {
    	const res = block.screenRes;
    	const width = res.replace(/^(\d+).*/, "$1");

    	if (width < 600) {
    		return "force-mobile force-tablet force-small force-medium";
    	} else if (width < 900) {
    		return "force-tablet force-small force-medium";
    	} else if (width < 1200) {
    		return "force-small force-medium";
    	} else if (width < 1800) {
    		return "force-medium";
    	}
    }

    function instance$1($$self, $$props, $$invalidate) {
    	let $toRender;
    	let $element;
    	validate_store(toRender, 'toRender');
    	component_subscribe($$self, toRender, $$value => $$invalidate(0, $toRender = $$value));
    	validate_store(element, 'element');
    	component_subscribe($$self, element, $$value => $$invalidate(1, $element = $$value));
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('PreviewBlocks', slots, []);

    	const blocks = [
    		{
    			deviceName: "iPhone 5/SE",
    			screenRes: "320 x 568",
    			mainpromo: { width: 272, height: 245 },
    			secondarypromo: { width: 272, height: 130 },
    			marketingblock: { width: 158, height: 316 }
    		},
    		{
    			deviceName: "Phone 1",
    			screenRes: "414 x 896",
    			mainpromo: { width: 366, height: 245 },
    			secondarypromo: { width: 366, height: 130 },
    			marketingblock: { width: 205, height: 318.35 }
    		},
    		{
    			deviceName: "iPhone 6/7/8",
    			screenRes: "414 x 896",
    			mainpromo: { width: 327, height: 245 },
    			secondarypromo: { width: 327, height: 130 },
    			marketingblock: { width: 186, height: 318.5 }
    		},
    		{
    			deviceName: "iPad Portrait",
    			screenRes: "768 x 1024",
    			mainpromo: { width: 720, height: 245 },
    			secondarypromo: { width: 720, height: 130 },
    			marketingblock: { width: 382.5, height: 302.75 }
    		},
    		{
    			deviceName: "iPad Landscape",
    			screenRes: "1024 x 768",
    			mainpromo: { width: 832, height: 600 },
    			secondarypromo: { width: 196, height: 250 },
    			marketingblock: { width: 340, height: 382.75 }
    		},
    		{
    			deviceName: "Small Desktop",
    			screenRes: "1366 x 768",
    			mainpromo: { width: 603, height: 600 },
    			secondarypromo: { width: 293.5, height: 250 },
    			marketingblock: { width: 271.95, height: 338.75 }
    		},
    		{
    			deviceName: "Medium Desktop 1",
    			screenRes: "1440 x 900",
    			mainpromo: { width: 640, height: 600 },
    			secondarypromo: { width: 312, height: 250 },
    			marketingblock: { width: 286.75, height: 338.75 }
    		},
    		{
    			deviceName: "Medium Desktop 2",
    			screenRes: "1536 x 864",
    			mainpromo: { width: 688, height: 600 },
    			secondarypromo: { width: 336, height: 250 },
    			marketingblock: { width: 305.95, height: 338.75 }
    		},
    		{
    			deviceName: "Medium Desktop 3",
    			screenRes: "1600 x 900",
    			mainpromo: { width: 720, height: 600 },
    			secondarypromo: { width: 352, height: 250 },
    			marketingblock: { width: 318.75, height: 338.75 }
    		},
    		{
    			deviceName: "Large Desktop",
    			screenRes: "1920 x 1080",
    			mainpromo: { width: 792, height: 600 },
    			secondarypromo: { width: 388, height: 250 },
    			marketingblock: { width: 382.75, height: 338.75 }
    		}
    	];

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<PreviewBlocks> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({
    		toRender,
    		element,
    		blocks,
    		checkPromoWidth,
    		$toRender,
    		$element
    	});

    	return [$toRender, $element, blocks];
    }

    class PreviewBlocks extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance$1, create_fragment$1, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "PreviewBlocks",
    			options,
    			id: create_fragment$1.name
    		});
    	}
    }

    /* src\App.svelte generated by Svelte v3.42.4 */
    const file = "src\\App.svelte";

    function create_fragment(ctx) {
    	let main;
    	let input;
    	let t;
    	let previewblocks;
    	let current;
    	input = new Input({ $$inline: true });
    	previewblocks = new PreviewBlocks({ $$inline: true });

    	const block = {
    		c: function create() {
    			main = element$1("main");
    			create_component(input.$$.fragment);
    			t = space();
    			create_component(previewblocks.$$.fragment);
    			add_location(main, file, 12, 0, 411);
    		},
    		l: function claim(nodes) {
    			throw new Error("options.hydrate only works if the component was compiled with the `hydratable: true` option");
    		},
    		m: function mount(target, anchor) {
    			insert_dev(target, main, anchor);
    			mount_component(input, main, null);
    			append_dev(main, t);
    			mount_component(previewblocks, main, null);
    			current = true;
    		},
    		p: noop,
    		i: function intro(local) {
    			if (current) return;
    			transition_in(input.$$.fragment, local);
    			transition_in(previewblocks.$$.fragment, local);
    			current = true;
    		},
    		o: function outro(local) {
    			transition_out(input.$$.fragment, local);
    			transition_out(previewblocks.$$.fragment, local);
    			current = false;
    		},
    		d: function destroy(detaching) {
    			if (detaching) detach_dev(main);
    			destroy_component(input);
    			destroy_component(previewblocks);
    		}
    	};

    	dispatch_dev("SvelteRegisterBlock", {
    		block,
    		id: create_fragment.name,
    		type: "component",
    		source: "",
    		ctx
    	});

    	return block;
    }

    function instance($$self, $$props, $$invalidate) {
    	let { $$slots: slots = {}, $$scope } = $$props;
    	validate_slots('App', slots, []);

    	onMount(() => {
    		const MBLink = document.createElement('link');
    		MBLink.href = 'https://www.decathlon.hu/static/css/marketingblocks.css';
    		MBLink.rel = 'stylesheet';
    		MBLink.type = 'text/css';
    		document.head.appendChild(MBLink);
    	});

    	const writable_props = [];

    	Object.keys($$props).forEach(key => {
    		if (!~writable_props.indexOf(key) && key.slice(0, 2) !== '$$' && key !== 'slot') console.warn(`<App> was created with unknown prop '${key}'`);
    	});

    	$$self.$capture_state = () => ({ Input, PreviewBlocks, onMount });
    	return [];
    }

    class App extends SvelteComponentDev {
    	constructor(options) {
    		super(options);
    		init(this, options, instance, create_fragment, safe_not_equal, {});

    		dispatch_dev("SvelteRegisterComponent", {
    			component: this,
    			tagName: "App",
    			options,
    			id: create_fragment.name
    		});
    	}
    }

    const app = new App({
        target: document.body,
        props: {}
    });

    return app;

}());
//# sourceMappingURL=bundle.js.map
