<script lang="ts">
  import Svelvet from '$lib/container/views/Svelvet.svelte';

  const data = {
    nodes: [
      {
        id: '1',
        width: 100,
        height: 100,
        position: { x: -215.90909090909093, y: -271.81818181818176 },
        data: { label: 'click to toggle children' },
        bgColor: 'white',
        borderColor: 'transparent',
        childNodes: [],
      },
      {
        id: '2',
        width: 125,
        height: 40,
        position: { x: -14.599880784679721, y: -308.44788239466266 },
        data: { label: '' },
        bgColor: 'white',
        textColor: 'black',
        childNodes: [],
      },
      {
        id: '3',
        width: 125,
        height: 40,
        position: { x: -9.999999999999996, y: -173.40909090909088 },
        data: { label: 'Click to toggle children' },
        bgColor: 'white',
        textColor: 'black',
        childNodes: [],
      },
      {
        id: '4',
        width: 125,
        height: 40,
        position: { x: -9.999999999999972, y: -65.4545454545454 },
        data: { label: '' },
        bgColor: 'white',
        textColor: 'black',
        childNodes: [],
      },
      {
        id: '5',
        width: 125,
        height: 40,
        position: { x: 200.6473652838072, y: -279.10075026201787 },
        data: { label: 'click to toggle children' },
        bgColor: 'white',
        textColor: 'black',
        childNodes: [],
      },
      {
        id: '9c5f794c-fbbe-4474-9fa0-2a7109986bb5',
        width: 100,
        height: 100,
        position: { x: 210.82628755426623, y: -170.711059495278 },
        data: { label: '' },
        bgColor: 'white',
        borderColor: 'black',
        textColor: 'black',
        borderRadius: 0,
        image: false,
        src: '',
        childNodes: [],
      },
      {
        id: '970e290c-5531-49b5-bcd6-91403f39cd04',
        width: 100,
        height: 100,
        position: { x: 445.43022472664, y: -321.65402130438576 },
        data: { label: '' },
        bgColor: 'white',
        borderColor: 'black',
        textColor: 'black',
        borderRadius: 0,
        image: false,
        src: '',
        childNodes: [],
      },
    ],
    edges: [
      {
        id: 'e1-2',
        label: 'edge label',
        type: 'bezier',
        source: '1',
        target: '2',
      },
      { id: '1214f547-9e72-4e4b-92b5-34f255f61c60', source: '1', target: '3' },
      { id: '79554af9-8576-4027-b321-529f17bd8ac3', source: '1', target: '4' },
      { id: '0a41cff5-62e7-4994-adf8-211025a25434', source: '3', target: '5' },
      {
        id: '6707a85c-d666-4cbb-ae0b-fac040e10b6a',
        source: '3',
        target: '9c5f794c-fbbe-4474-9fa0-2a7109986bb5',
      },
      {
        id: '6834f810-83b0-4f41-b5c6-af9983f0e820',
        source: '5',
        target: '970e290c-5531-49b5-bcd6-91403f39cd04',
      },
    ],
  };
</script>

<h1>Collapsible node feature</h1>
<p>Click on a node to collapse its children. Click again to expand.</p>
<p>
  Node connectivity must form a tree, ie, each node can only have one parent.
</p>
<p>
  Note that collapsible, when enabled, will disable 'interactiveNodes' as these
  features are incompatible.
</p>

<Svelvet
  canvasId="canvas1"
  nodes={data['nodes']}
  edges={data['edges']}
  width={900}
  height={900}
  background
  shareable={true}
  collapsible={true}
  nodeCreate={true}
/>
