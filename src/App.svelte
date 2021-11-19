<script lang="ts">
	import Input from "./Input.svelte";
	import PreviewBlocks from "./PreviewBlocks.svelte";
<<<<<<< Updated upstream
=======
	import { onMount } from "svelte";


	onMount(()=> {
		const MBLink = document.createElement('link');
        MBLink.href = 'https://www.decathlon.hu/static/css/marketingblocks.css';
        MBLink.rel = 'stylesheet';
        MBLink.type = 'text/css';
        document.head.appendChild(MBLink);
	});
>>>>>>> Stashed changes
</script>

<main>
	<Input />
	<PreviewBlocks />
</main>
