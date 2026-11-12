import type {CaseStudyData} from '@/components/site/case-study';

const img = (file: string) => `/assets/projects/bustech/${file}`;

export const bustech: CaseStudyData = {
  slug: 'bustech',
  homeAnchor: 'project-bustech',
  name: 'BusGuard',
  tags: ['Hackathon', '1st Runner-Up'],
  context: 'LTA Singapore BusTech Grand Challenge 2026',
  lead: "Passenger assistance for autonomous vehicles. Cameras, a passenger app and a 3D model of the bus work together so that wheelchair users, seniors, parents with strollers and people with vision or hearing difficulties can still get help when there's no driver on board.",
  facts: [
    {label: 'My role', value: 'Networking and System Integration'},
    {label: 'Team', value: 'NEW-ACTY, Singapore Polytechnic'},
    {label: 'Timeline', value: 'June to October 2026'},
    {label: 'Result', value: '1st Runner-Up'},
    {label: 'Tools', value: 'YOLOE, Python FastAPI, MQTT, RTSP'},
  ],
  hero: {
    kind: 'image', src: img('poster.webp'), width: 1100, height: 1555, natural: true,
    alt: "Team NEW-ACTY's BusGuard Grand Final poster: Singapore Polytechnic, team names, 'Your journey. Your pace.' with the 3D bus and passengers using wheelchairs, canes and strollers, and the three features: AI voice assistant, computer vision and passenger app",
    caption: 'Our Grand Final poster.',
  },
  parts: [
    {kind: 'sections', sections: [
      {
        id: 'overview', title: 'Overview',
        blocks: [
          {kind: 'p', text: "On an autonomous vehicle there's no driver to ask for help. A wheelchair user may need the ramp, a senior may need more time to board, and someone with poor eyesight may need the next stop read out. BusGuard makes sure they still get that help."},
          {kind: 'list', items: [
            {lead: 'Cameras', text: 'spot people who may need help, such as someone in a wheelchair or with a stroller, walking frame or cane.'},
            {lead: 'A passenger app, a card tap or a button', text: "lets anyone ask for help directly, including needs a camera can't see."},
            {lead: 'An operator console,', text: "used by the person watching over the bus remotely, shows how full the bus is, who has asked for help, and whether it's safe to leave."},
          ]},
          {kind: 'p', text: 'We built it for the LTA Singapore BusTech Grand Challenge 2026, a national competition run by the Land Transport Authority. Our team of five reached the Grand Final and finished 1st Runner-Up.'},
          {kind: 'p', lead: 'My part was the networking:', text: 'making sure every piece could talk to every other piece. I connected the security camera to our system, set up the messaging that carries information between the different parts, and made sure the live video reached the operator console without dropping out. Everything runs on a small private network, with no internet needed.'},
        ],
        media: {
          kind: 'image', src: img('physical-inputs.webp'), width: 1600, height: 1200, crop: true,
          alt: 'Prototype hardware: a white Bosch bullet camera, a black PoE network switch and a 3D-printed BusGuard box with a card reader and Emergency and Ramp buttons',
          caption: 'Our real hardware: a Bosch security camera, a network switch that powers it through its cable, and our BusGuard box with a card reader and Emergency and Ramp buttons.',
        },
      },
      {
        id: 'how-it-works', title: 'How it works',
        blocks: [
          {kind: 'list', ordered: true, items: [
            {lead: 'The camera watches the door.', text: 'It sends live video over a network cable (using RTSP, a standard way to stream camera video).'},
            {lead: 'AI looks at the video.', text: 'It draws a box around each person and anything like a wheelchair or stroller, so the system knows who might need help.'},
            {lead: 'Messages connect everything.', text: 'When the AI spots something, or a passenger presses a button or uses the app, a short message is sent to the rest of the system (using MQTT, a lightweight messaging system).'},
            {lead: 'One "brain" makes the decisions.', text: "It keeps track of who needs help, how full the bus is, and whether it's safe to leave. If it isn't sure, the bus waits."},
            {lead: 'Three views of the same information:', text: 'the passenger app, the operator console, and a 3D model of the bus that shows the doors, ramp and journey.'},
          ]},
          {kind: 'p', text: 'Our automated tests (over 1,200 checks) all passed, and the prototype cost only about SGD 50 because we reused equipment we already had.'},
        ],
        media: {
          kind: 'image', src: img('detection-console.webp'), width: 1600, height: 671,
          alt: 'Operator detection console with two camera panels, outside boarding area and inside passenger cabin, each showing people and strollers outlined with labelled boxes',
          caption: 'The operator console: the AI has boxed and labelled each person and stroller it found, outside the bus and inside.',
        },
      },
      {
        id: 'challenges', title: 'Challenges',
        blocks: [
          {kind: 'p', lead: 'A frozen picture can lie.', text: "If the camera's video freezes, the screen keeps showing the last picture. An empty doorway in an old picture could make the bus think it's safe to close the doors when someone is actually there. So the system always checks how old each picture is. If the video stops or gets stuck, the bus waits instead of guessing."},
          {kind: 'p', lead: 'Messages can arrive twice.', text: "If a button press is sent again because the network was slow, the ramp shouldn't go down twice. Every request is confirmed once and repeats are ignored. After a restart, the system waits for fresh information before doing anything."},
          {kind: 'p', lead: 'Working without the internet.', text: 'Everything runs on a small private network on the bus, so it keeps working with no signal and the video never leaves the bus. The trade-off is that one computer does all the work, so we have to keep an eye on how much it can handle as more cameras are added.'},
        ],
        media: {
          kind: 'image', src: img('emergency.webp'), width: 1600, height: 900, crop: true,
          alt: 'Digital twin of the bus stopped in a yellow-hatched refuge area during an emergency',
          caption: 'An emergency in our 3D model: the bus pulls over to a safe spot and alerts the operator.',
        },
      },
    ]},
    {kind: 'gallery', title: 'Gallery', images: [
      {kind: 'image', src: img('cabin-inside.webp'), width: 1920, height: 1080, crop: true, alt: 'Inside the 3D bus cabin: rows of blue standard seats, yellow priority seats, grab handles and a camera mounted on the ceiling', caption: 'Inside the 3D bus: 20 standard seats, 6 priority seats and a shared wheelchair or stroller bay.'},
      {kind: 'image', src: img('passenger-app.webp'), width: 1600, height: 1200, alt: "BusGuard passenger app asking 'How can we help?' with options for ramp access, more time, audio guidance, visual guidance and priority seating", caption: 'Passenger app: choose the support you need.'},
      {kind: 'image', src: img('twin-cabin-ui.webp'), width: 1600, height: 900, crop: true, alt: 'Digital twin web interface showing the bus with its roof and sides removed to reveal the cabin, next to a live seat availability panel', caption: 'Digital twin web interface in cabin view, with live seat availability.'},
      {kind: 'image', src: img('door-display.webp'), width: 1400, height: 788, crop: true, alt: 'Close-up of the bus door with a display above it showing priority seats, standard seats and wheelchair bay availability', caption: 'Display above the door showing seat and wheelchair-bay availability before boarding.'},
      {kind: 'image', src: img('cabin-cutaway.webp'), width: 1600, height: 900, crop: true, alt: 'Cutaway of the 3D bus showing the chassis, seating layout and handrails from above', caption: 'Cutaway of the cabin layout in the 3D model.'},
      {kind: 'image', src: img('hero-ramp.webp'), width: 1920, height: 1080, crop: true, alt: '3D digital twin of a green autonomous bus at a stop with its wheelchair ramp deployed onto the pavement', caption: 'Our 3D model of the bus: it has stopped and lowered its ramp so a wheelchair user can get on.'},
      {kind: 'image', src: img('exterior.webp'), width: 1200, height: 675, crop: true, alt: 'Exterior of the green 3D autonomous bus model from the front right, on a road beside trees', caption: 'Exterior of the 3D bus model.'},
    ]},
    {kind: 'learned', items: [
      {lead: 'Plan for things going wrong.', text: "Cameras and networks don't always work perfectly. Deciding what the system should do when the video drops out mattered as much as making it work on a good day."},
      {lead: 'Build in separate pieces.', text: 'Because each part only had to send and receive simple messages, different teammates could build the camera, AI, app and 3D model on their own, and they still worked together.'},
      {lead: 'Agree early on how the pieces talk.', text: 'In a team of five, deciding the message formats at the start is what let us put everything together before the deadline.'},
    ]},
  ],
  next: {name: 'Windows Server Domain', href: '/projects/windows-server.html'},
};
