// Converted from the hand-drawn SVG on the old static site. Colours and type are Sodium tokens,
// so the diagram follows the light and dark themes.
export function NetworkDiagram() {
  return (
  <svg className="block h-auto w-full" viewBox="0 0 720 560" role="img" aria-labelledby="network-diagram-title">
  <title id="network-diagram-title">Network diagram, laid out like the brief's logical diagram. The internet connects to R1, the ISP router. Serial links run from R1 to R2 (border router and firewall) and R7 (backup border router). Inside the main building (OSPF Area 0), R2 and R7 connect to a server switch with the web and file servers, and to the backbone switch, which connects R3 and R5. R5 serves the Administration office. A serial link runs from R3 to R4, the area border router, which serves the Sales office (Area 2) and connects to R6, which serves the Engineering office (Area 1).</title>
  <defs>
  <symbol id="dg-rtr" viewBox="0 0 80 50">
  <path fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" d="M3 14v22a37 11 0 0 0 74 0V14"/>
  <ellipse fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" cx="40" cy="14"/>
  <path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M22 14h13M45 14h13M28 10l-6 4 6 4M52 10l6 4-6 4"/>
  </symbol>
  <symbol id="dg-sw" viewBox="0 0 80 32">
  <rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="2" width="76" height="28"/>
  <path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M20 12h38M52 8l6 4-6 4M60 20H22M28 16l-6 4 6 4"/>
  </symbol>
  <symbol id="dg-srv" viewBox="0 0 110 96">
  <path fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" d="M14 2h82l12 14H2z"/>
  <rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="20" width="106" height="24"/><path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M16 27v10M24 27v10M32 27v10M54 32h22"/><circle fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" cx="92" cy="32" r="5"/>
  <rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="46" width="106" height="24"/><path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M16 53v10M24 53v10M32 53v10M54 58h22"/><circle fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" cx="92" cy="58" r="5"/>
  <rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="72" width="106" height="22"/><path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M16 78v10M24 78v10M32 78v10M54 83h22"/><circle fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" cx="92" cy="83" r="5"/>
  </symbol>
  <symbol id="dg-pc" viewBox="0 0 120 96">
  <rect fill="var(--page)" stroke="var(--text-1)" strokeWidth="3.5" strokeLinejoin="miter" x="2" y="4" width="80" height="60"/>
  <path fill="none" stroke="var(--text-1)" strokeWidth="3.5" strokeLinecap="square" d="M42 64v12M22 80h40"/>
  <rect fill="var(--text-1)" x="90" y="0" width="28" height="96"/>
  <path fill="none" stroke="var(--page)" strokeWidth="3" strokeLinecap="square" d="M96 12h16M96 20h16M96 28h16"/>
  <circle fill="var(--page)" cx="104" cy="74" r="4"/>
  </symbol>
  </defs>

  <rect fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="7 6" x="200" y="160" width="518" height="380"/>
  <text className="type-caption" fill="var(--text-3)" x="214" y="530">Main building · Area 0</text>
  <rect fill="none" stroke="var(--text-3)" strokeWidth="1.5" strokeDasharray="7 6" x="383" y="296" width="308" height="232"/>
  <text className="type-caption" fill="var(--text-3)" x="680" y="516" textAnchor="end">Administration office</text>
  <rect fill="var(--page)" stroke="var(--line)" strokeWidth="1.5" x="15" y="190" width="165" height="200"/>
  <text className="type-caption" fill="var(--text-3)" x="27" y="210">Engineering · Area 1</text>
  <rect fill="var(--page)" stroke="var(--line)" strokeWidth="1.5" x="15" y="420" width="140" height="120"/>
  <text className="type-caption" fill="var(--text-3)" x="27" y="528">Sales · Area 2</text>

  <path fill="none" stroke="var(--text-3)" strokeWidth="2" d="M192 55H218M345 152L482 196M462 156L500 189M542 200L600 183M542 200L600 233M330 155V238M455 156L352 240M316 262L270 312M346 262L430 312M470 340L532 393M546 413L512 449M574 413L618 433M60 263V311M92 323H110M148 342L190 452M168 470H98"/>
  <path fill="none" stroke="var(--text-1)" strokeWidth="3" strokeLinejoin="miter" d="M255 72L284 94L272 98L312 120M284 58L358 72L350 82L442 122M248 350L232 400L246 404L212 455"/>

  <path fill="var(--page)" stroke="var(--line)" strokeWidth="1.5" d="M62 80a20 20 0 0 1 2-38a26 26 0 0 1 48-14a24 24 0 0 1 44 6a22 22 0 0 1 30 26a18 18 0 0 1-8 20z"/>
  <text className="type-body" fill="var(--text-1)" x="122" y="62" textAnchor="middle">Internet</text>
  <use href="#dg-rtr" x="218" y="34" width="64" height="40"/>
  <text className="type-code" fill="var(--text-1)" x="250" y="24" textAnchor="middle">R1<tspan className="type-caption" fill="var(--text-2)">{' · ISP router'}</tspan></text>

  <use href="#dg-rtr" x="298" y="115" width="64" height="40"/>
  <text className="type-code" fill="var(--text-1)" x="290" y="140" textAnchor="end">R2</text>
  <text className="type-caption" fill="var(--text-2)" x="290" y="155" textAnchor="end">Border router + firewall</text>
  <use href="#dg-rtr" x="430" y="115" width="64" height="40"/>
  <text className="type-code" fill="var(--text-1)" x="502" y="132">R7</text>
  <text className="type-caption" fill="var(--text-2)" x="502" y="148">Backup border router</text>

  <use href="#dg-sw" x="478" y="187" width="64" height="26"/>
  <text className="type-caption" fill="var(--text-3)" x="510" y="232" textAnchor="middle">HSRP shared gateway</text>
  <use href="#dg-srv" x="600" y="166" width="40" height="35"/>
  <text className="type-caption" fill="var(--text-2)" x="646" y="188">Web server</text>
  <use href="#dg-srv" x="600" y="216" width="40" height="35"/>
  <text className="type-caption" fill="var(--text-2)" x="646" y="238">File server</text>

  <use href="#dg-sw" x="298" y="237" width="64" height="26"/>

  <use href="#dg-rtr" x="228" y="310" width="64" height="40"/>
  <text className="type-code" fill="var(--text-1)" x="300" y="330">R3</text>
  <text className="type-caption" fill="var(--text-2)" x="300" y="346">To branches</text>
  <use href="#dg-rtr" x="408" y="310" width="64" height="40"/>
  <text className="type-code" fill="var(--text-1)" x="440" y="370" textAnchor="middle">R5</text>
  <text className="type-caption" fill="var(--text-2)" x="440" y="386" textAnchor="middle">Admin gateway</text>

  <use href="#dg-sw" x="528" y="387" width="64" height="26"/>
  <use href="#dg-pc" x="482" y="448" width="56" height="45"/>
  <use href="#dg-pc" x="612" y="428" width="56" height="45"/>

  <use href="#dg-pc" x="32" y="218" width="56" height="45"/>
  <use href="#dg-sw" x="28" y="310" width="64" height="26"/>
  <use href="#dg-rtr" x="108" y="303" width="64" height="40"/>
  <text className="type-code" fill="var(--text-1)" x="140" y="296" textAnchor="middle">R6</text>

  <use href="#dg-rtr" x="168" y="450" width="64" height="40"/>
  <text className="type-code" fill="var(--text-1)" x="240" y="472">R4</text>
  <text className="type-caption" fill="var(--text-2)" x="240" y="488">Area border router</text>
  <use href="#dg-pc" x="42" y="448" width="56" height="45"/>
  </svg>
  );
}
