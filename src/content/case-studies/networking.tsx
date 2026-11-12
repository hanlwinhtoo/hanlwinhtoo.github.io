import type {CaseStudyData} from '@/components/site/case-study';
import {NetworkDiagram} from '@/components/site/diagrams/network-diagram';

const img = (file: string) => `/assets/projects/networking/${file}`;

export const networking: CaseStudyData = {
  slug: 'networking',
  homeAnchor: 'project-network',
  name: 'Multi-Site Company Network',
  tags: ['School project', 'Individual work'],
  context: 'ET0010 Computer Networking, mini project',
  lead: 'The network for a company with a main office and two branch offices, designed and built on my own in Cisco Packet Tracer: the address plan, the routing between sites, backup links and a firewall.',
  facts: [
    {label: 'My role', value: 'Individual work: design, build and testing'},
    {label: 'Timeline', value: 'AY2026/27, Semester 1'},
    {label: 'Platform', value: 'Cisco Packet Tracer, Cisco IOS'},
    {label: 'Tools', value: 'OSPF, HSRP, ACLs, VLSM subnetting'},
  ],
  hero: {kind: 'diagram', diagram: <NetworkDiagram/>, caption: 'The company network: the main building (Area 0) and two branch offices. Zigzags are serial links.'},
  stats: [
    {label: 'Routers', value: '7'},
    {label: 'OSPF areas', value: '3'},
    {label: 'Address headroom', value: '2x'},
    {label: 'Loss in failover', value: '0%'},
  ],
  parts: [
    {kind: 'sections', sections: [{
      id: 'overview', title: 'Overview',
      blocks: [
        {kind: 'p', text: 'For my Computer Networking module, I had to design and build the network for ABC Pte Ltd, a pretend IT company. Its main office has the Admin team and the company\'s web and file servers. Two branch offices, Engineering and Sales, connect to it over a long-distance link, and the main office connects to the internet through an internet provider.'},
        {kind: 'p', text: 'This was individual work, so I did everything: planning the addresses, setting up all 7 routers, adding backups so one failure doesn\'t take the company offline, adding a firewall, and testing it all. I built it in Cisco Packet Tracer, which simulates real Cisco equipment.'},
      ],
      media: {kind: 'image', src: img('topology.webp'), width: 1381, height: 1033, alt: 'Cisco Packet Tracer workspace showing the finished network: routers R1 to R7, four switches, web and file servers, and PCs for the Admin, Sales and Engineering offices, joined by Ethernet and red serial cables', caption: 'The finished network in Cisco Packet Tracer. Red lines are serial (long-distance) links.'},
    }]},
    {kind: 'sections', title: 'What I built', sections: [
      {
        id: 'addressing', title: 'An address plan with room to double',
        blocks: [
          {kind: 'p', text: 'Every device needs an address, like a phone number. The company gave me one block of 256 addresses, and expects each office to double in size over the next 5 to 10 years.'},
          {kind: 'p', text: 'I split the block into right-sized pieces (VLSM), each big enough for twice today\'s staff. The whole network uses 184 of the 256 addresses, so the rest stay free for later.'},
        ],
        tools: ['VLSM', 'Subnetting', 'IPv4'],
        media: {
          kind: 'table', title: 'How I split the addresses',
          columns: [{label: 'Network'}, {label: 'Addresses needed'}, {label: 'Size given', numeric: true}],
          rows: [
            ['Admin office', '56 (28 staff, doubled)', '62'],
            ['Engineering office', '46 (23 staff, doubled)', '62'],
            ['Sales office', '22 (11 staff, doubled)', '30'],
            ['Servers', '5 (fixed maximum)', '6'],
            ['Main office routers', '4', '6'],
            ['Link R3 to R4', '2', '2'],
            ['Link R4 to R6', '2', '2'],
          ],
          note: 'Taken from the block 198.100.190.0/24, largest network first.',
        },
      },
      {
        id: 'static-routes', title: 'A route to the internet',
        blocks: [
          {kind: 'p', text: 'The internet provider\'s router (R1) shouldn\'t learn the company\'s internal routes, so I set two fixed directions by hand:'},
          {kind: 'list', items: [
            {lead: 'R1:', text: '"anything for the company\'s addresses, send to R2".'},
            {lead: 'R2:', text: '"anything that isn\'t inside the company, send to the internet" (a default route).'},
          ]},
        ],
        tools: ['Static routes', 'Default route'],
        media: {kind: 'image', src: img('static-routes.webp'), width: 1600, height: 650, alt: 'Two router command windows. R1\'s routing table shows a static route for 198.100.190.0/24 via 220.220.219.2. R2\'s routing table shows \'Gateway of last resort is 220.220.219.1\' and a default static route 0.0.0.0/0 via 220.220.219.1', caption: 'R1\'s route to the company (left) and R2\'s default route to the internet (right), both boxed in red.'},
      },
      {
        id: 'ospf-areas', title: 'Three areas that share their routes',
        blocks: [
          {kind: 'p', text: 'Inside the company, the routers find paths to each other automatically using OSPF, a routing protocol. I split the network into three areas: the main office (Area 0) and one for each branch (Areas 1 and 2). A change inside one branch then stays inside that branch.'},
          {kind: 'p', text: 'R4 sits on the edge of all three areas and passes routes between them. I also stopped routing messages being sent out towards office PCs, since only routers need them.'},
        ],
        tools: ['Multi-area OSPF', 'Area border router', 'Passive interfaces'],
        media: {kind: 'image', src: img('ospf-areas.webp'), width: 1079, height: 651, alt: 'R4 running configuration for OSPF process 99: router-id 4.4.4.4, passive-interface GigabitEthernet0/1, and three network statements in area 0, area 1 and area 2', caption: 'R4\'s routing settings: one network in each of areas 0, 1 and 2.'},
      },
      {
        id: 'dr-bdr', title: 'A leader for the main office routers',
        blocks: [
          {kind: 'p', text: 'Four routers share the main office network. Rather than every router swapping updates with every other, OSPF picks one leader to collect and share them (the designated router), plus a backup.'},
          {kind: 'p', text: 'I set priorities so the choice is fixed: R2 is the leader and R5 is its backup.'},
        ],
        tools: ['OSPF DR and BDR', 'Router priority', 'Loopback router IDs'],
        media: {kind: 'image', src: img('dr-bdr.webp'), width: 1600, height: 828, alt: 'R2 output of show ip ospf interface GigabitEthernet0/0: State DR, Priority 100, Designated Router 2.2.2.2, Backup Designated Router 5.5.5.5, adjacent with neighbours 5.5.5.5, 7.7.7.7 and 3.3.3.3', caption: 'R2 is the designated router ("State DR"), and R5 (5.5.5.5) is the backup.'},
      },
      {
        id: 'timers', title: 'Calmer check-ins on the slow link',
        blocks: [{kind: 'p', text: 'Routers send each other a regular "hello" to show they\'re still alive. On the slower serial link to the branches, I spaced these out to every 20 seconds, and a router is only treated as down after 80 seconds of silence. This means less chatter on a slow line.'}],
        tools: ['OSPF hello and dead timers'],
        media: {kind: 'image', src: img('ospf-timers.webp'), width: 1600, height: 779, alt: 'R3 output of show ip ospf interface Serial0/0/0: point-to-point link in area 0, with \'Timer intervals configured, Hello 20, Dead 80, Wait 80, Retransmit 5\' boxed in red', caption: 'R3\'s serial link: hello every 20 seconds, down after 80 seconds.'},
      },
      {
        id: 'backup-isp', title: 'A backup way to the internet',
        blocks: [{kind: 'p', text: 'If R2 fails, the company would lose the internet. I added a second border router, R7, with its own link to the internet provider. R7 tells the other routers "you can reach the internet through me too", so traffic switches to it on its own.'}],
        tools: ['Redundancy', 'default-information originate'],
        media: {kind: 'image', src: img('backup-isp.webp'), width: 1146, height: 792, alt: 'R7 running configuration for OSPF process 99: router-id 7.7.7.7, networks in area 0, and \'default-information originate\' boxed in red', caption: 'R7 shares its internet route with the other routers ("default-information originate").'},
      },
      {
        id: 'hsrp', title: 'Servers that never lose their gateway',
        blocks: [{kind: 'p', text: 'The web and file servers send all their traffic through one gateway address. R2 and R7 share that address using HSRP. R2 normally handles it, and R7 waits on standby. If R2 goes down, R7 takes over the same address, so the servers don\'t need any changes.'}],
        tools: ['HSRP', 'First-hop redundancy'],
        media: {kind: 'image', src: img('hsrp.webp'), width: 1600, height: 673, alt: 'Two command windows running show standby brief. R2 shows group 1, priority 110, state Active, virtual IP 198.100.190.161. R7 shows priority 90, state Standby, with the same virtual IP', caption: 'R2 is active (top) and R7 is on standby (bottom), sharing the gateway address .161.'},
      },
      {
        id: 'firewall', title: 'A firewall at the front door',
        blocks: [
          {kind: 'p', text: 'R2 checks every message coming in from the internet against a list of rules (an access control list):'},
          {kind: 'checks', items: [
            {pass: true, lead: 'Allowed', text: 'visits to the company website (web and secure web)'},
            {pass: true, lead: 'Allowed', text: 'replies to connections started from inside, and ping tests'},
            {pass: false, lead: 'Blocked', text: 'traffic pretending to come from private or fake addresses'},
            {pass: false, lead: 'Blocked', text: 'everything else'},
          ]},
        ],
        tools: ['Extended ACL', 'Border firewall'],
        media: {kind: 'image', src: img('firewall.webp'), width: 1044, height: 531, alt: 'R2 extended IP access list BORDER_FIREWALL: deny 10.0.0.0, 172.16.0.0, 192.168.0.0 and 127.0.0.0 sources; permit TCP to host 198.100.190.162 on www and 443; permit established TCP; permit ICMP echo-reply, echo and unreachable; deny ip any any. Below, the list is applied inbound on Serial0/0/0', caption: 'The firewall rules (boxed), applied to traffic coming in on R2\'s internet link.'},
      },
    ]},
    {kind: 'sections', title: 'Tested', sections: [
      {
        id: 'reachability', title: 'Every office can reach every other',
        blocks: [
          {kind: 'p', text: 'From a PC in the Admin office, I sent test messages (pings) to the Engineering office, the Sales office and the web server. Every message got a reply, with none lost.'},
          {kind: 'checks', items: [
            {pass: true, lead: 'Engineering office', text: '4 of 4 replies'},
            {pass: true, lead: 'Sales office', text: '4 of 4 replies'},
            {pass: true, lead: 'Web server', text: '4 of 4 replies'},
          ]},
        ],
        media: {kind: 'image', src: img('ping-test.webp'), width: 1042, height: 968, alt: 'Admin PC command prompt pinging 198.100.190.66, 198.100.190.130 and 198.100.190.162, each with 4 replies and 0% loss', caption: 'Pings from the Admin PC to Engineering (.66), Sales (.130) and the web server (.162): 0% loss.'},
      },
      {
        id: 'failover', title: 'Still working with the main router switched off',
        blocks: [
          {kind: 'p', text: 'A backup only counts if it works, so I turned R2 off in the simulator and tested again. The offices could still reach each other, and the internet provider\'s router was still reachable through the backup router, R7.'},
          {kind: 'checks', items: [
            {pass: true, lead: 'Offices and servers', text: 'still reachable, 0% loss'},
            {pass: true, lead: 'Internet provider via R7', text: '4 of 4 replies'},
          ]},
        ],
        media: {kind: 'image', src: img('failover.webp'), width: 1009, height: 954, alt: 'Top: Packet Tracer physical view of R2 with its power switch boxed in red. Bottom: Admin PC pinging 220.220.219.5, the ISP router\'s link to R7, with 4 replies and 0% loss', caption: 'R2\'s power switch turned off (top), and the Admin PC still reaching the internet provider through R7 (bottom).'},
      },
    ]},
    {kind: 'sections', title: 'Cost and next steps', sections: [{
      id: 'cost', title: 'What it would cost',
      blocks: [{kind: 'p', text: 'I also estimated the cost of building it for real: about S$22,780, mostly the 7 routers and the 2 servers.'}],
      media: {
        kind: 'table', title: 'Budget estimate',
        columns: [{label: 'Item'}, {label: 'Qty', numeric: true}, {label: 'Cost (S$)', numeric: true}],
        rows: [
          ['Cisco 1941 routers', '7', '10,500'],
          ['Cisco 2960 switches', '5', '3,500'],
          ['Rack servers (web, file)', '2', '5,000'],
          ['Internet lines (main and backup)', '2', '1,200'],
          ['Cables', '', '580'],
          ['Installation and testing', '1', '2,000'],
        ],
        total: ['Total', '', '22,780'],
      },
    }]},
    {kind: 'rows', title: 'What I\'d improve next', rows: [
      {title: 'A second internet provider', text: 'R1 is still the only way out to the internet. A second, separate provider would remove that single point of failure.'},
      {title: 'Backup gateways for every office', text: 'HSRP only protects the servers today. Adding it for the Admin, Sales and Engineering offices would protect everyone.'},
      {title: 'Tighter security', text: 'Encrypted remote logins (SSH instead of Telnet), passwords on routing messages, and locking switch ports to known devices.'},
    ]},
    {kind: 'learned', items: [
      {lead: 'Plan the addresses first.', text: 'Once the address table was right, setting up each router was straightforward. A mistake there would have spread everywhere.'},
      {lead: 'A backup isn\'t real until you test it.', text: 'Switching R2 off was the only way to prove that R7 and HSRP actually take over.'},
      {lead: 'Areas keep routing tidy.', text: 'Splitting the network into areas means a change in one branch doesn\'t make every router recalculate.'},
    ]},
  ],
  next: {name: 'BusGuard', href: '/projects/bustech.html'},
};
