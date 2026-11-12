// Everything the home page says, in one place. Edit the text here; the
// layout in src/pages/home.tsx reads it. Keep every line short: the detail
// lives on the case-study pages and in resume.pdf.

export const person = {
  name: 'Han Lwin Htoo',
  headline: 'Cloud, infrastructure and security. Computer Engineering student at Singapore Polytechnic.',
  availability: 'Open to internships, Mar to Aug 2027',
  email: 'hanlwinhtoo.connect@gmail.com',
  linkedin: 'https://www.linkedin.com/in/hanlwinhtoo',
  github: 'https://github.com/hanlwinhtoo',
  resume: '/resume.pdf',
};

/** One row in a resume section: a name, one short line and a date. */
export type Entry = {
  id?: string;
  title: string;
  line: string;
  date: string;
  href?: string;
  tag?: string;
};

export const projects: Entry[] = [
  {
    id: 'project-bustech',
    title: 'BusGuard',
    line: 'Passenger assistance for autonomous vehicles. 1st Runner-Up, LTA BusTech Grand Challenge.',
    date: 'Oct 2026',
    href: '/projects/bustech.html',
  },
  {
    id: 'project-winserver',
    title: 'Windows Server Domain',
    line: 'File, storage and web server for a company domain.',
    date: 'Jul 2026',
    href: '/projects/windows-server.html',
  },
  {
    id: 'project-network',
    title: 'Multi-Site Company Network',
    line: 'Seven-router OSPF network across three sites, with failover.',
    date: 'Aug 2026',
    href: '/projects/networking.html',
  },
  {
    id: 'project-homelab',
    title: 'Proxmox Homelab',
    line: 'Self-hosted lab with Tailscale access, no open ports and scripted backups.',
    date: 'Ongoing',
  },
  {
    id: 'project-aws',
    title: 'AWS VPC Web Server',
    line: 'Custom VPC with EC2 and S3 access through IAM roles.',
    date: 'In progress',
  },
];

export const education: Entry[] = [
  {title: 'Singapore Polytechnic', line: 'Diploma in Computer Engineering, Cloud Systems', date: '2025 to 2028'},
  {title: 'Guarantee International College', line: 'Cambridge IGCSE, 4 A* and 1 A', date: '2023 to 2024'},
];

export const certifications: Entry[] = [
  {title: 'Introduction to Networking', line: 'NVIDIA', date: 'Oct 2026'},
  {title: 'AI for Essential Digital Skills', line: 'AI Singapore', date: 'Sep 2026'},
  {title: 'Introduction to Cybersecurity', line: 'Cisco Networking Academy', date: 'Sep 2026'},
  {title: 'RH124 System Administration I', line: 'Red Hat', date: 'Aug 2026'},
  {title: 'CCNA', line: 'Cisco', date: 'Jan 2027', tag: 'Studying'},
  {title: 'RHCSA', line: 'Red Hat', date: 'Feb 2027', tag: 'Studying'},
  {title: 'AWS SAA-C03', line: 'Solutions Architect Associate', date: 'Mar 2027', tag: 'Studying'},
];

export const skills = [
  {label: 'Cloud', value: 'AWS IAM, EC2, S3, VPC'},
  {label: 'Servers', value: 'Proxmox, VMware, Windows Server, Active Directory'},
  {label: 'Linux', value: 'RHEL, Bash scripting, SSH, systemd'},
  {label: 'Networking', value: 'Cisco IOS, OSPF, HSRP, ACLs, VLANs'},
  {label: 'Code', value: 'Python, PowerShell, Git'},
];

export const volunteering: Entry[] = [
  {title: 'KSUG.AI user group', line: 'Community volunteer and event assistant', date: '2025 to 2026'},
];
