import type {CaseStudyData} from '@/components/site/case-study';
import {WindowsServerDiagram} from '@/components/site/diagrams/windows-server-diagram';

const img = (file: string) => `/assets/projects/windows-server/${file}`;

export const windowsServer: CaseStudyData = {
  slug: 'windows-server',
  homeAnchor: 'project-winserver',
  name: 'Windows Server Domain',
  tags: ['School project'],
  context: 'ET0015 Server Management, mini project',
  lead: 'A complete office computer network, built from virtual machines by four students. I built the server that stores everyone\'s files and runs the company websites.',
  facts: [
    {label: 'My role', value: 'File, storage and web server (DC2)'},
    {label: 'Team', value: 'Four students, Singapore Polytechnic'},
    {label: 'Timeline', value: 'AY2026/27, Semester 1'},
    {label: 'Platform', value: 'Windows Server 2025, Windows 11, VMware'},
    {label: 'Tools', value: 'Active Directory, IIS, FSRM, AD CS, PowerShell'},
  ],
  hero: {kind: 'diagram', diagram: <WindowsServerDiagram/>, caption: 'Our network. Every machine is a virtual machine. DC2 is the one I built.'},
  stats: [
    {label: 'Team folders', value: '5'},
    {label: 'Disks in RAID-5', value: '3'},
    {label: 'HTTPS sites', value: '2'},
    {label: 'Sync tests passed', value: '4/4'},
  ],
  parts: [
    {kind: 'sections', sections: [{
      id: 'overview', title: 'Overview',
      blocks: [
        {kind: 'p', text: 'For a school module, four of us set up the computer systems for a pretend office, the way an IT team would for a real company: staff accounts, shared folders, websites and secure access from home. Everything ran as virtual machines (computers simulated in software) on our laptops.'},
        {kind: 'p', lead: 'My job was DC2,', text: 'the server that stores everyone\'s files and runs the company websites. Staff belong to three teams (Manager, Sales and Remote), and what each person can open or save depends on their team.'},
      ],
    }]},
    {kind: 'sections', title: 'What I built', sections: [
      {
        id: 'raid', title: 'Files that survive a broken disk',
        blocks: [{kind: 'p', text: 'I combined three disks into one drive, with the files spread across all three. If any one disk breaks, nothing is lost. Every shared folder lives on this drive.'}],
        tools: ['RAID-5', 'NTFS', 'Disk Management'],
        media: {kind: 'image', src: img('raid5.webp'), width: 792, height: 640, alt: 'Disk Management on DC2: a healthy 988 MB RAID-5 volume E: spread across Disk 0, Disk 1 and Disk 2, each 496 MB and dynamic', caption: 'Disks 0, 1 and 2 working together as one drive (E:), all healthy.'},
      },
      {
        id: 'shares', title: 'A folder for each team, ready at login',
        blocks: [
          {kind: 'p', text: 'Each team has its own shared folder that other teams can\'t open: VIP for Managers, Logistics for Sales and IT for the Remote team. There\'s also Common, which everyone shares.'},
          {kind: 'p', text: 'When staff log in, their folders appear as drives automatically. They don\'t have to set anything up.'},
        ],
        tools: ['File shares', 'NTFS permissions', 'Group Policy'],
        media: {kind: 'image', src: img('mapped-drives.webp'), width: 550, height: 280, alt: 'Network locations on a Remote user\'s PC: their home folder on H:, the IT share on X: with a 20 MB limit, and Common on Z: with a 10 MB limit', caption: 'A Remote team member just after logging in: their private folder (H:), the team\'s IT folder (X:) and the shared Common folder (Z:).'},
      },
    ]},
    {kind: 'media', media: {
      kind: 'table', title: 'The folders, and who can do what',
      columns: [{label: 'Folder'}, {label: 'Who it\'s for'}, {label: 'Shows up as'}, {label: 'Who can open it'}, {label: 'Who can save to it'}, {label: 'What can be saved'}, {label: 'Size limit'}],
      rows: [
        ['Common', 'Everyone', 'Z: drive', 'Everyone', 'Managers only', 'Only text files and web pages', '10 MB'],
        ['VIP', 'Managers', 'X: drive', 'Managers', 'Managers', 'Anything except programs and scripts', '20 MB'],
        ['Logistics', 'Sales team', 'X: drive', 'Sales team', 'Sales team', 'Anything except programs and scripts', '20 MB'],
        ['IT', 'Remote team', 'X: drive', 'Remote team', 'Remote team', 'Anything except programs and scripts', '20 MB'],
        ['Personal', 'Each person', 'H: drive', 'Only its owner', 'Only its owner', 'Anything', 'None'],
      ],
      note: 'The IT administrator has full control of every folder. "Programs and scripts" means .exe, .bat and .ps1 files.',
    }},
    {kind: 'sections', sections: [
      {
        id: 'quotas', title: 'A size limit on every folder',
        blocks: [{kind: 'p', text: 'Each team folder can hold up to 20 MB, and the shared folder 10 MB. Once a folder is full, nothing more can be saved, so one team can\'t fill up the whole server.'}],
        tools: ['FSRM', 'Quotas'],
        media: {kind: 'image', src: img('fsrm-quotas.webp'), width: 486, height: 184, alt: 'File Server Resource Manager quota list: Logistics, IT and VIP at 20 MB hard quota, Common at 10 MB hard quota', caption: 'The limits I set: 20 MB for the Logistics, IT and VIP team folders, and 10 MB for Common.'},
      },
      {
        id: 'screens', title: 'Risky files blocked, and tested',
        blocks: [
          {kind: 'p', text: 'Programs and scripts can carry viruses, so the team folders block them. Common only takes text files and web pages (see the table above).'},
          {kind: 'p', text: 'To check the rules, I tried saving different kinds of files into two folders: Logistics (the Sales team\'s folder) and Common (everyone\'s folder).'},
          {kind: 'checks', items: [
            {pass: true, lead: 'Saved', text: 'a text file (.txt) in Logistics and in Common'},
            {pass: false, lead: 'Refused', text: 'a program (.exe) and a script (.ps1) in Logistics'},
            {pass: false, lead: 'Refused', text: 'a picture (.jpg) in Common, which only takes text and web pages'},
          ]},
        ],
        tools: ['FSRM', 'File screens'],
        media: {kind: 'image', src: img('fsrm-test.webp'), width: 883, height: 733, alt: 'PowerShell window: saving test.txt to the Logistics share succeeds, saving test.exe and test.ps1 to Logistics and test.jpg to Common fails with \'Access to the path is denied\', and saving test.txt to Common succeeds', caption: 'My test in a command window. Each line tries to save one file: the .txt files saved, and the .exe, .ps1 and .jpg files were refused with "Access denied".'},
      },
      {
        id: 'personal', title: 'A private folder for everyone',
        blocks: [{kind: 'p', text: 'A script I wrote creates each person\'s private folder the first time they log in. The folders are hidden from everyone else, so people only ever see their own.'}],
        tools: ['PowerShell', 'Access-Based Enumeration'],
        media: {kind: 'image', src: img('abe-share.webp'), width: 852, height: 336, alt: 'PowerShell output of Get-SmbShare for personal$: path E:\\Personal, FolderEnumerationMode AccessBased', caption: 'The private folders\' setting is "AccessBased", which hides other people\'s folders.'},
      },
      {
        id: 'websites', title: 'Secure company websites',
        blocks: [{kind: 'p', text: 'I set up two company websites. Both open with the padlock in the address bar and no security warning, because they use certificates from our own certificate authority.'}],
        tools: ['IIS', 'AD CS', 'HTTPS'],
        media: {kind: 'image', src: img('https-sites.webp'), width: 1008, height: 281, alt: 'Two Edge windows: https://www.wss07a.sg showing \'Welcome to www webpage!\' and https://test.wss07a.sg showing \'Welcome to test webpage!\', both with the padlock icon and no certificate warning', caption: 'Both websites open securely: see the padlock (boxed in red) next to each address.'},
      },
      {
        id: 'work-folders', title: 'Files that sync between laptop and server', tag: 'Extra feature',
        blocks: [
          {kind: 'p', text: 'I set up Work Folders for the Remote team. It keeps a copy of each person\'s work files on both their laptop and the server, and syncs changes automatically, a bit like a company-run OneDrive.'},
          {kind: 'p', text: 'All four tests passed. Each person\'s files stay private: even the IT administrator can\'t open them.'},
        ],
        tools: ['Work Folders', 'HTTPS'],
        media: {kind: 'image', src: img('workfolders-denied.webp'), width: 630, height: 310, alt: 'Folder list on DC2 showing user folders rmt-001 and rmt-024, with a dialog: \'You have been denied permission to access this folder\'', caption: 'The administrator tries to open user rmt-001\'s synced folder and is denied, as intended.'},
      },
    ]},
    {kind: 'sections', title: 'Problems I fixed', sections: [{
      id: 'certificates', title: 'Browsers didn\'t trust our websites',
      blocks: [
        {kind: 'p', text: 'At first, browsers showed a security warning. Each website\'s certificate (its digital ID card) was missing a detail that browsers check.'},
        {kind: 'fix', text: 'I requested new certificates with that detail included. Now browsers trust them.'},
      ],
      media: {kind: 'image', src: img('cert-test.webp'), width: 408, height: 519, alt: 'Windows certificate dialog: issued to test.wss07a.sg, issued by sp-root-ca, valid from 8/11/2026 to 8/10/2028, with a private key', caption: 'The new certificate for test.wss07a.sg, issued by our own certificate authority (sp-root-ca).'},
    }]},
    {kind: 'rows', title: 'More fixes', rows: [
      {title: 'A website that went round in circles', text: 'Sending visitors from the insecure address (http) to the secure one (https) also redirected the secure address, so the page never loaded.', fix: 'I made a tiny separate site whose only job is the redirect.'},
      {title: 'Two services, one door', text: 'The file sync and the websites both needed the same network "door" (port 443, used for secure web traffic).', fix: 'I set them up so the server can tell which service each visitor wants, and both work side by side.'},
    ]},
    {kind: 'learned', items: [
      {lead: 'Keep the rules in one place.', text: 'I set every access rule in one layer, so when something went wrong there was only one place to look.'},
      {lead: 'Most website security problems are certificate problems.', text: 'The certificate\'s details, and whether computers trust whoever issued it, both have to be right.'},
      {lead: 'Test as a normal user.', text: 'An admin account can open almost anything, so it hides mistakes.'},
    ]},
  ],
  next: {name: 'Multi-Site Company Network', href: '/projects/networking.html'},
};
