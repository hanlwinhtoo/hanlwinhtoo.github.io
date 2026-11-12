// Converted from the hand-drawn SVG on the old static site. Colours and type are Sodium tokens,
// so the diagram follows the light and dark themes.
export function WindowsServerDiagram() {
  return (
  <svg className="block h-auto w-full" viewBox="0 0 720 625" role="img" aria-labelledby="winserver-diagram-title">
  <title id="winserver-diagram-title">Network diagram of the wss07a.sg domain. On the bridged 10.10.0.0/24 network: DC1 at 10.10.0.10 (DNS, DHCP, AD DS, AD CS, Group Policy), DC2 at 10.10.0.20 (file shares, FSRM, IIS, Work Folders, marked as my part), Client01, the router at 10.10.0.1, and three extra servers for RemoteApp with AD FS (ADFS01, RDS01, WAP01). The router and Client02 run on one laptop, joined by the host-only 10.20.0.0/24 network.</title>
  <defs>
  <symbol id="dg-srv" viewBox="0 0 110 96">
  <path fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" d="M14 2h82l12 14H2z"/>
  <g ><rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="20" width="106" height="24"/><path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M16 27v10M24 27v10M32 27v10M40 27v10M54 32h22"/><circle fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" cx="92" cy="32" r="5"/></g>
  <g ><rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="46" width="106" height="24"/><path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M16 53v10M24 53v10M32 53v10M40 53v10M54 58h22"/><circle fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" cx="92" cy="58" r="5"/></g>
  <g ><rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="72" width="106" height="22"/><path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M16 78v10M24 78v10M32 78v10M40 78v10M54 83h22"/><circle fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" cx="92" cy="83" r="5"/></g>
  </symbol>
  <symbol id="dg-pc" viewBox="0 0 120 96">
  <rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="4" width="80" height="60"/>
  <path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M42 64v12M22 80h40"/>
  <rect fill="var(--text-1)" x="90" y="0" width="28" height="96"/>
  <path fill="none" stroke="var(--page)" strokeWidth="3" strokeLinecap="square" d="M96 12h16M96 20h16M96 28h16"/>
  <circle fill="var(--page)" cx="104" cy="74" r="4"/>
  </symbol>
  </defs>

  <text className="type-body" fill="var(--text-1)" x="360" y="30" textAnchor="middle">wss07a.sg domain</text>

  <path fill="none" stroke="var(--text-3)" strokeWidth="2" d="M240 105V495M180 105H330M180 382H240M240 330H340M240 495H605M365 495v15M485 495v15M605 495v15"/>
  <text className="type-caption" fill="var(--text-3)" x="232" y="258" textAnchor="end">10.10.0.0/24</text>
  <text className="type-caption" fill="var(--text-3)" x="232" y="274" textAnchor="end">bridged</text>

  <use href="#dg-srv" x="70" y="57" width="110" height="96"/>
  <text className="type-code" fill="var(--text-1)" x="125" y="180" textAnchor="middle">DC1</text>
  <text className="type-code-sm" fill="var(--text-2)" x="125" y="198" textAnchor="middle">10.10.0.10</text>
  <text className="type-caption" fill="var(--text-2)" x="125" y="216" textAnchor="middle">DNS · DHCP · AD DS</text>
  <text className="type-caption" fill="var(--text-2)" x="125" y="232" textAnchor="middle">AD CS · Group Policy</text>

  <use href="#dg-pc" x="330" y="57" width="120" height="96"/>
  <text className="type-code" fill="var(--text-1)" x="380" y="180" textAnchor="middle">Client01</text>
  <text className="type-code-sm" fill="var(--text-2)" x="380" y="198" textAnchor="middle">DHCP · 10.10.0.151+</text>
  <text className="type-caption" fill="var(--text-2)" x="380" y="216" textAnchor="middle">Windows 11</text>

  <rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="2" x="40" y="292" width="170" height="236"/>
  <rect fill="var(--text-1)" x="88" y="304" width="74" height="20"/>
  <text className="type-micro" fill="var(--page)" x="125" y="318" textAnchor="middle">My part</text>
  <use href="#dg-srv" x="70" y="334" width="110" height="96"/>
  <text className="type-code" fill="var(--text-1)" x="125" y="452" textAnchor="middle">DC2</text>
  <text className="type-code-sm" fill="var(--text-2)" x="125" y="470" textAnchor="middle">10.10.0.20</text>
  <text className="type-caption" fill="var(--text-2)" x="125" y="488" textAnchor="middle">File shares · FSRM</text>
  <text className="type-caption" fill="var(--text-2)" x="125" y="504" textAnchor="middle">IIS · Work Folders</text>

  <rect fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="7 6" x="305" y="248" width="400" height="216"/>
  <text className="type-caption" fill="var(--text-3)" x="690" y="268" textAnchor="end">same laptop</text>
  <use href="#dg-srv" x="340" y="282" width="110" height="96"/>
  <text className="type-code" fill="var(--text-1)" x="395" y="402" textAnchor="middle">Router</text>
  <text className="type-code-sm" fill="var(--text-2)" x="395" y="420" textAnchor="middle">10.10.0.1 · 10.20.0.1</text>
  <text className="type-caption" fill="var(--text-2)" x="395" y="438" textAnchor="middle">RRAS · VPN · DHCP relay</text>
  <path fill="none" stroke="var(--text-3)" strokeWidth="2" strokeDasharray="6 5" d="M454 330H546"/>
  <text className="type-caption" fill="var(--text-3)" x="500" y="320" textAnchor="middle">host-only</text>
  <text className="type-caption" fill="var(--text-3)" x="500" y="350" textAnchor="middle">10.20.0.0/24</text>
  <use href="#dg-pc" x="550" y="282" width="120" height="96"/>
  <text className="type-code" fill="var(--text-1)" x="600" y="402" textAnchor="middle">Client02</text>
  <text className="type-code-sm" fill="var(--text-2)" x="600" y="420" textAnchor="middle">DHCP · 10.20.0.100+</text>
  <text className="type-caption" fill="var(--text-2)" x="600" y="438" textAnchor="middle">Windows 11 · VPN client</text>

  <text className="type-caption" fill="var(--text-3)" x="254" y="486">Extra feature: RemoteApp with AD FS</text>
  <use href="#dg-srv" x="330" y="510" width="70" height="61"/>
  <use href="#dg-srv" x="450" y="510" width="70" height="61"/>
  <use href="#dg-srv" x="570" y="510" width="70" height="61"/>
  <text className="type-code" fill="var(--text-1)" x="365" y="592" textAnchor="middle">ADFS01</text>
  <text className="type-code-sm" fill="var(--text-2)" x="365" y="610" textAnchor="middle">10.10.0.40</text>
  <text className="type-code" fill="var(--text-1)" x="485" y="592" textAnchor="middle">RDS01</text>
  <text className="type-code-sm" fill="var(--text-2)" x="485" y="610" textAnchor="middle">10.10.0.30</text>
  <text className="type-code" fill="var(--text-1)" x="605" y="592" textAnchor="middle">WAP01</text>
  <text className="type-code-sm" fill="var(--text-2)" x="605" y="610" textAnchor="middle">10.10.0.50</text>
  </svg>
  );
}
