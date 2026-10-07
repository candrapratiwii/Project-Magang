const assetPathPrefix = "/assets"
const imgIndicator = `${assetPathPrefix}/27f4c.svg`
const imgIndicator1 = `${assetPathPrefix}/3a5de.svg`
const imgIndicator2 = `${assetPathPrefix}/9f710.svg`
const imgIndicator3 = `${assetPathPrefix}/e721f.svg`

export default function ManajemenPenggunaScreen() {
  return (
    <div
      className="bg-[#f3f6fa] content-stretch flex items-start relative size-full"
      data-node-id="1:1286"
      data-name="Manajemen Pengguna screen"
    >
      <div
        className="bg-[#102a43] content-stretch flex flex-col gap-[22px] items-start min-h-[1024px] overflow-clip pb-[20px] pt-[24px] px-[22px] relative self-stretch shrink-0 w-[244px]"
        data-node-id="1:1287"
        data-name="Sidebar"
      >
        <p
          className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[15px] text-white w-full"
          data-node-id="1:1288"
        >
          SIMPERA-NET
        </p>
        <p
          className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#d5e2ef] text-[12px] w-full"
          data-node-id="1:1289"
        >
          Bidang Teknologi dan Informasi
        </p>
        <div
          className="bg-[#29455f] h-px relative shrink-0 w-full"
          data-node-id="1:1290"
          data-name="Divider"
        />
        <div
          className="[word-break:break-word] content-stretch flex flex-col gap-[18px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 text-[12px] w-full"
          data-node-id="1:1291"
          data-name="Navigation"
        >
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1292"
          >
            Dashboard
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1293"
          >
            Master Barang
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1294"
          >
            Barang Masuk
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1295"
          >
            Barang Keluar
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1296"
          >
            Stok Opname
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1297"
          >
            Laporan
          </p>
          <p
            className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#65a1ff] w-full whitespace-pre-wrap"
            data-node-id="1:1298"
          >{`●  Manajemen Pengguna`}</p>
        </div>
      </div>
      <div
        className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-[1040px] min-w-px overflow-clip relative"
        data-node-id="1:1299"
        data-name="Workspace"
      >
        <div
          className="[word-break:break-word] bg-white border-[#dce4ee] border-b border-solid content-stretch flex h-[76px] items-center justify-between leading-[normal] not-italic overflow-clip px-[32px] relative shrink-0 w-full whitespace-nowrap"
          data-node-id="1:1300"
          data-name="Top bar"
        >
          <p
            className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[16px]"
            data-node-id="1:1301"
          >
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p
            className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px]"
            data-node-id="1:1302"
          >
            Ayu Pramesti · Admin
          </p>
        </div>
        <div
          className="content-stretch flex flex-col gap-[24px] items-start overflow-clip p-[32px] relative shrink-0 w-full"
          data-node-id="1:1303"
          data-name="Page content"
        >
          <div
            className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-center justify-between not-italic overflow-clip relative shrink-0 w-full"
            data-node-id="1:1304"
            data-name="Page heading"
          >
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[5px] items-start leading-[normal] min-w-px overflow-clip relative"
              data-node-id="1:1305"
              data-name="Heading copy"
            >
              <p
                className="relative shrink-0 text-[#172b4d] text-[26px] w-full"
                data-node-id="1:1306"
              >
                Manajemen Pengguna
              </p>
              <p
                className="relative shrink-0 text-[#64748b] text-[14px] w-full"
                data-node-id="1:1307"
              >
                Kelola akun, status akses, dan peran pengguna sistem
              </p>
            </div>
            <div
              className="bg-[#1769e0] border border-[#1769e0] border-solid content-stretch flex gap-[8px] h-[40px] items-center justify-center overflow-clip px-[15px] relative rounded-[8px] shrink-0 text-white"
              data-node-id="1:1308"
              data-name="Button"
            >
              <div
                className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                data-node-id="1:1309"
              >
                <p className="leading-[normal]">+</p>
              </div>
              <p
                className="leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap"
                data-node-id="1:1310"
              >
                Tambah pengguna
              </p>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full"
            data-node-id="1:1311"
            data-name="User summary"
          >
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[11px] items-center min-w-px overflow-clip p-[15px] relative rounded-[8px]"
              data-node-id="1:1312"
              data-name="Summary card"
            >
              <div
                className="bg-[#eaf2ff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1313"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#1769e0] text-[13.6px] text-center"
                  data-node-id="1:1314"
                >
                  <p className="leading-[normal]">●</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1315"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1316"
                >
                  5
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1317"
                >
                  Total pengguna
                </p>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[11px] items-center min-w-px overflow-clip p-[15px] relative rounded-[8px]"
              data-node-id="1:1318"
              data-name="Summary card"
            >
              <div
                className="bg-[#f2ecff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1319"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#7c3aed] text-[13.6px] text-center"
                  data-node-id="1:1320"
                >
                  <p className="leading-[normal]">✓</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1321"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1322"
                >
                  2
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1323"
                >
                  Admin
                </p>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[11px] items-center min-w-px overflow-clip p-[15px] relative rounded-[8px]"
              data-node-id="1:1324"
              data-name="Summary card"
            >
              <div
                className="bg-[#e6f7fa] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1325"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#0891b2] text-[13.6px] text-center"
                  data-node-id="1:1326"
                >
                  <p className="leading-[normal]">◆</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1327"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1328"
                >
                  3
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1329"
                >
                  Petugas Gudang
                </p>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[11px] items-center min-w-px overflow-clip p-[15px] relative rounded-[8px]"
              data-node-id="1:1330"
              data-name="Summary card"
            >
              <div
                className="bg-[#eaf8ef] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1331"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#15803d] text-[13.6px] text-center"
                  data-node-id="1:1332"
                >
                  <p className="leading-[normal]">✓</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1333"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1334"
                >
                  4
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1335"
                >
                  Akun aktif
                </p>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
            data-node-id="1:1336"
            data-name="User management"
          >
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[14px] items-start min-w-px relative"
              data-node-id="1:1337"
              data-name="User directory"
            >
              <div
                className="content-stretch flex gap-[10px] items-end overflow-clip relative shrink-0 w-full"
                data-node-id="1:1338"
                data-name="Toolbar"
              >
                <div
                  className="[word-break:break-word] bg-white border border-[#dce4ee] border-solid content-stretch flex font-['Inter:Regular'] font-normal gap-[8px] h-[40px] items-center not-italic overflow-clip px-[12px] relative rounded-[8px] shrink-0 text-[#94a3b8] w-[320px]"
                  data-node-id="1:1339"
                  data-name="Search"
                >
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                    data-node-id="1:1340"
                  >
                    <p className="leading-[normal]">⌕</p>
                  </div>
                  <p
                    className="flex-[1_0_0] leading-[normal] min-w-px relative text-[14px]"
                    data-node-id="1:1341"
                  >
                    Cari nama atau nama pengguna...
                  </p>
                </div>
                <div
                  className="[word-break:break-word] bg-white border border-[#dce4ee] border-solid content-stretch flex font-['Inter:Regular'] font-normal gap-[10px] h-[40px] items-center not-italic overflow-clip px-[12px] relative rounded-[8px] shrink-0"
                  data-node-id="1:1342"
                  data-name="Filter"
                >
                  <p
                    className="leading-[normal] relative shrink-0 text-[#172b4d] text-[14px] whitespace-nowrap"
                    data-node-id="1:1343"
                  >
                    Semua peran
                  </p>
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[14px] text-[#64748b] text-[11.2px] text-center"
                    data-node-id="1:1344"
                  >
                    <p className="leading-[normal]">›</p>
                  </div>
                </div>
                <div
                  className="[word-break:break-word] bg-white border border-[#dce4ee] border-solid content-stretch flex font-['Inter:Regular'] font-normal gap-[10px] h-[40px] items-center not-italic overflow-clip px-[12px] relative rounded-[8px] shrink-0"
                  data-node-id="1:1345"
                  data-name="Filter"
                >
                  <p
                    className="leading-[normal] relative shrink-0 text-[#172b4d] text-[14px] whitespace-nowrap"
                    data-node-id="1:1346"
                  >
                    Semua status
                  </p>
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[14px] text-[#64748b] text-[11.2px] text-center"
                    data-node-id="1:1347"
                  >
                    <p className="leading-[normal]">›</p>
                  </div>
                </div>
                <div
                  className="flex-[1_0_0] h-px min-w-px relative"
                  data-node-id="1:1348"
                  data-name="Toolbar spacer"
                />
              </div>
              <div
                className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-col items-start relative rounded-[12px] shrink-0 w-full"
                data-node-id="1:1349"
                data-name="User table"
              >
                <div
                  className="[word-break:break-word] bg-[#f8fafc] border-[#dce4ee] border-b border-solid content-stretch flex font-['Inter:Regular'] font-normal gap-[12px] h-[42px] items-center leading-[normal] not-italic px-[16px] relative shrink-0 text-[#64748b] text-[11px] uppercase w-full"
                  data-node-id="1:1350"
                  data-name="Table header"
                >
                  <p
                    className="relative shrink-0 w-[190px]"
                    data-node-id="1:1351"
                  >
                    Pengguna
                  </p>
                  <p
                    className="relative shrink-0 w-[100px]"
                    data-node-id="1:1352"
                  >
                    Nama pengguna
                  </p>
                  <p
                    className="relative shrink-0 w-[130px]"
                    data-node-id="1:1353"
                  >
                    Peran
                  </p>
                  <p
                    className="relative shrink-0 w-[75px]"
                    data-node-id="1:1354"
                  >
                    Status
                  </p>
                  <p
                    className="relative shrink-0 w-[95px]"
                    data-node-id="1:1355"
                  >
                    Login terakhir
                  </p>
                  <p
                    className="flex-[1_0_0] min-w-px relative text-right"
                    data-node-id="1:1356"
                  >
                    Aksi
                  </p>
                </div>
                <div
                  className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[66px] overflow-clip px-[16px] relative shrink-0 w-full"
                  data-node-id="1:1357"
                  data-name="User row"
                >
                  <div
                    className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-[190px]"
                    data-node-id="1:1358"
                    data-name="User"
                  >
                    <div
                      className="bg-[#f2ecff] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[36px]"
                      data-node-id="1:1359"
                      data-name="Avatar"
                    >
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#7c3aed] text-[11px] whitespace-nowrap"
                        data-node-id="1:1360"
                      >
                        AP
                      </p>
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[3px] items-start leading-[normal] min-w-px not-italic overflow-clip relative"
                      data-node-id="1:1361"
                      data-name="Identity"
                    >
                      <p
                        className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[12px] w-full"
                        data-node-id="1:1362"
                      >
                        Ayu Pramesti
                      </p>
                      <p
                        className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[9px] w-full"
                        data-node-id="1:1363"
                      >
                        ayu.pramesti@badungkab.go.id
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[100px]"
                    data-node-id="1:1364"
                  >
                    ayu.pramesti
                  </p>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[130px]"
                    data-node-id="1:1365"
                    data-name="Role"
                  >
                    <div
                      className="bg-[#f2ecff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1366"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1367"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap"
                        data-node-id="1:1368"
                      >
                        Admin
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[75px]"
                    data-node-id="1:1369"
                    data-name="Status"
                  >
                    <div
                      className="bg-[#eaf8ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1370"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1371"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator1}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[12px] whitespace-nowrap"
                        data-node-id="1:1372"
                      >
                        Aktif
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.4] not-italic relative shrink-0 text-[#64748b] text-[9px] w-[95px]"
                    data-node-id="1:1373"
                  >
                    05 Okt 2026 · 09.28
                  </p>
                  <div
                    className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px overflow-clip relative"
                    data-node-id="1:1374"
                    data-name="Actions"
                  >
                    <div
                      className="border border-[#dce4ee] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[30px]"
                      data-node-id="1:1375"
                      data-name="Edit"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[14px] text-[#1769e0] text-[11.2px] text-center"
                        data-node-id="1:1376"
                      >
                        <p className="leading-[normal]">◆</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[66px] overflow-clip px-[16px] relative shrink-0 w-full"
                  data-node-id="1:1377"
                  data-name="User row"
                >
                  <div
                    className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-[190px]"
                    data-node-id="1:1378"
                    data-name="User"
                  >
                    <div
                      className="bg-[#eaf2ff] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[36px]"
                      data-node-id="1:1379"
                      data-name="Avatar"
                    >
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[11px] whitespace-nowrap"
                        data-node-id="1:1380"
                      >
                        MA
                      </p>
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[3px] items-start leading-[normal] min-w-px not-italic overflow-clip relative"
                      data-node-id="1:1381"
                      data-name="Identity"
                    >
                      <p
                        className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[12px] w-full"
                        data-node-id="1:1382"
                      >
                        Made Aditya
                      </p>
                      <p
                        className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[9px] w-full"
                        data-node-id="1:1383"
                      >
                        made.aditya@badungkab.go.id
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[100px]"
                    data-node-id="1:1384"
                  >
                    made.aditya
                  </p>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[130px]"
                    data-node-id="1:1385"
                    data-name="Role"
                  >
                    <div
                      className="bg-[#eaf2ff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1386"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1387"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator2}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[12px] whitespace-nowrap"
                        data-node-id="1:1388"
                      >
                        Petugas Gudang
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[75px]"
                    data-node-id="1:1389"
                    data-name="Status"
                  >
                    <div
                      className="bg-[#eaf8ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1390"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1391"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator1}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[12px] whitespace-nowrap"
                        data-node-id="1:1392"
                      >
                        Aktif
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.4] not-italic relative shrink-0 text-[#64748b] text-[9px] w-[95px]"
                    data-node-id="1:1393"
                  >
                    05 Okt 2026 · 08.54
                  </p>
                  <div
                    className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px overflow-clip relative"
                    data-node-id="1:1394"
                    data-name="Actions"
                  >
                    <div
                      className="border border-[#dce4ee] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[30px]"
                      data-node-id="1:1395"
                      data-name="Edit"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[14px] text-[#1769e0] text-[11.2px] text-center"
                        data-node-id="1:1396"
                      >
                        <p className="leading-[normal]">◆</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[66px] overflow-clip px-[16px] relative shrink-0 w-full"
                  data-node-id="1:1397"
                  data-name="User row"
                >
                  <div
                    className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-[190px]"
                    data-node-id="1:1398"
                    data-name="User"
                  >
                    <div
                      className="bg-[#eaf2ff] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[36px]"
                      data-node-id="1:1399"
                      data-name="Avatar"
                    >
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[11px] whitespace-nowrap"
                        data-node-id="1:1400"
                      >
                        KA
                      </p>
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[3px] items-start leading-[normal] min-w-px not-italic overflow-clip relative"
                      data-node-id="1:1401"
                      data-name="Identity"
                    >
                      <p
                        className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[12px] w-full"
                        data-node-id="1:1402"
                      >
                        Komang Arta
                      </p>
                      <p
                        className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[9px] w-full"
                        data-node-id="1:1403"
                      >
                        komang.arta@badungkab.go.id
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[100px]"
                    data-node-id="1:1404"
                  >
                    komang.arta
                  </p>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[130px]"
                    data-node-id="1:1405"
                    data-name="Role"
                  >
                    <div
                      className="bg-[#eaf2ff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1406"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1407"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator2}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[12px] whitespace-nowrap"
                        data-node-id="1:1408"
                      >
                        Petugas Gudang
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[75px]"
                    data-node-id="1:1409"
                    data-name="Status"
                  >
                    <div
                      className="bg-[#eaf8ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1410"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1411"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator1}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[12px] whitespace-nowrap"
                        data-node-id="1:1412"
                      >
                        Aktif
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.4] not-italic relative shrink-0 text-[#64748b] text-[9px] w-[95px]"
                    data-node-id="1:1413"
                  >
                    04 Okt 2026 · 16.18
                  </p>
                  <div
                    className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px overflow-clip relative"
                    data-node-id="1:1414"
                    data-name="Actions"
                  >
                    <div
                      className="border border-[#dce4ee] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[30px]"
                      data-node-id="1:1415"
                      data-name="Edit"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[14px] text-[#1769e0] text-[11.2px] text-center"
                        data-node-id="1:1416"
                      >
                        <p className="leading-[normal]">◆</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[66px] overflow-clip px-[16px] relative shrink-0 w-full"
                  data-node-id="1:1417"
                  data-name="User row"
                >
                  <div
                    className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-[190px]"
                    data-node-id="1:1418"
                    data-name="User"
                  >
                    <div
                      className="bg-[#f2ecff] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[36px]"
                      data-node-id="1:1419"
                      data-name="Avatar"
                    >
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#7c3aed] text-[11px] whitespace-nowrap"
                        data-node-id="1:1420"
                      >
                        DW
                      </p>
                    </div>
                    <div
                      className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[3px] items-start leading-[normal] min-w-px not-italic overflow-clip relative"
                      data-node-id="1:1421"
                      data-name="Identity"
                    >
                      <p
                        className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[12px] w-full"
                        data-node-id="1:1422"
                      >
                        Desak Wulandari
                      </p>
                      <p
                        className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[9px] w-full"
                        data-node-id="1:1423"
                      >
                        desak.wulandari@badungkab.go.id
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[100px]"
                    data-node-id="1:1424"
                  >
                    desak.wulandari
                  </p>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[130px]"
                    data-node-id="1:1425"
                    data-name="Role"
                  >
                    <div
                      className="bg-[#f2ecff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1426"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1427"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap"
                        data-node-id="1:1428"
                      >
                        Admin
                      </p>
                    </div>
                  </div>
                  <div
                    className="content-stretch flex items-start overflow-clip relative shrink-0 w-[75px]"
                    data-node-id="1:1429"
                    data-name="Status"
                  >
                    <div
                      className="bg-[#eaf8ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                      data-node-id="1:1430"
                      data-name="Status"
                    >
                      <div
                        className="relative shrink-0 size-[6px]"
                        data-node-id="1:1431"
                        data-name="Indicator"
                      >
                        <img
                          alt=""
                          className="absolute block inset-0 max-w-none size-full"
                          src={imgIndicator1}
                        />
                      </div>
                      <p
                        className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[12px] whitespace-nowrap"
                        data-node-id="1:1432"
                      >
                        Aktif
                      </p>
                    </div>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.4] not-italic relative shrink-0 text-[#64748b] text-[9px] w-[95px]"
                    data-node-id="1:1433"
                  >
                    04 Okt 2026 · 14.02
                  </p>
                  <div
                    className="content-stretch flex flex-[1_0_0] items-start justify-end min-w-px overflow-clip relative"
                    data-node-id="1:1434"
                    data-name="Actions"
                  >
                    <div
                      className="border border-[#dce4ee] border-solid content-stretch flex items-center justify-center overflow-clip relative rounded-[6px] shrink-0 size-[30px]"
                      data-node-id="1:1435"
                      data-name="Edit"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[14px] text-[#1769e0] text-[11.2px] text-center"
                        data-node-id="1:1436"
                      >
                        <p className="leading-[normal]">◆</p>
                      </div>
                    </div>
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic overflow-clip p-[16px] relative shrink-0 text-[10px] w-full whitespace-nowrap"
                  data-node-id="1:1437"
                  data-name="User table footer"
                >
                  <p
                    className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b]"
                    data-node-id="1:1438"
                  >
                    5 pengguna terdaftar
                  </p>
                  <p
                    className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1769e0]"
                    data-node-id="1:1439"
                  >
                    Lihat aktivitas akun →
                  </p>
                </div>
              </div>
            </div>
            <div
              className="content-stretch flex flex-col gap-[14px] items-start relative shrink-0 w-[330px]"
              data-node-id="1:1440"
              data-name="Role information"
            >
              <div
                className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-col gap-[16px] items-start p-[18px] relative rounded-[12px] shrink-0 w-[330px]"
                data-node-id="1:1441"
                data-name="Role access"
              >
                <div
                  className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[4px] items-start not-italic overflow-clip relative shrink-0 w-full"
                  data-node-id="1:1442"
                  data-name="Role heading"
                >
                  <p
                    className="leading-[normal] relative shrink-0 text-[#172b4d] text-[14px] whitespace-nowrap"
                    data-node-id="1:1443"
                  >
                    Hak akses per peran
                  </p>
                  <p
                    className="leading-[1.4] min-w-full relative shrink-0 text-[#64748b] text-[10px] w-[min-content]"
                    data-node-id="1:1444"
                  >
                    Ringkasan modul yang dapat diakses oleh setiap peran.
                  </p>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex font-['Inter:Bold'] font-bold gap-[8px] items-start leading-[normal] not-italic overflow-clip pb-[7px] relative shrink-0 text-[#94a3b8] text-[9px] uppercase w-full"
                  data-node-id="1:1445"
                  data-name="Permission header"
                >
                  <p
                    className="flex-[1_0_0] min-w-px relative"
                    data-node-id="1:1446"
                  >
                    Modul
                  </p>
                  <p
                    className="relative shrink-0 text-center w-[45px]"
                    data-node-id="1:1447"
                  >
                    Admin
                  </p>
                  <p
                    className="relative shrink-0 text-center w-[55px]"
                    data-node-id="1:1448"
                  >
                    Petugas
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full"
                  data-node-id="1:1449"
                  data-name="Permissions"
                >
                  <div
                    className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[8px] items-center min-h-[38px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1450"
                    data-name="Permission"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#172b4d] text-[10px]"
                      data-node-id="1:1451"
                    >{`Dashboard & notifikasi`}</p>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[45px]"
                      data-node-id="1:1452"
                      data-name="Admin access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1453"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[55px]"
                      data-node-id="1:1454"
                      data-name="Officer access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1455"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[8px] items-center min-h-[38px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1456"
                    data-name="Permission"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#172b4d] text-[10px]"
                      data-node-id="1:1457"
                    >
                      Master barang
                    </p>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[45px]"
                      data-node-id="1:1458"
                      data-name="Admin access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1459"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[55px]"
                      data-node-id="1:1460"
                      data-name="Officer access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1461"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[8px] items-center min-h-[38px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1462"
                    data-name="Permission"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#172b4d] text-[10px]"
                      data-node-id="1:1463"
                    >
                      Barang masuk / keluar
                    </p>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[45px]"
                      data-node-id="1:1464"
                      data-name="Admin access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1465"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[55px]"
                      data-node-id="1:1466"
                      data-name="Officer access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1467"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[8px] items-center min-h-[38px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1468"
                    data-name="Permission"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#172b4d] text-[10px]"
                      data-node-id="1:1469"
                    >
                      Stok opname
                    </p>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[45px]"
                      data-node-id="1:1470"
                      data-name="Admin access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1471"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[55px]"
                      data-node-id="1:1472"
                      data-name="Officer access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1473"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                  </div>
                  <div
                    className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[8px] items-center min-h-[38px] overflow-clip relative shrink-0 w-full"
                    data-node-id="1:1474"
                    data-name="Permission"
                  >
                    <p
                      className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#172b4d] text-[10px]"
                      data-node-id="1:1475"
                    >{`Laporan & export`}</p>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[45px]"
                      data-node-id="1:1476"
                      data-name="Admin access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1477"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                    <div
                      className="content-stretch flex items-start justify-center overflow-clip relative shrink-0 w-[55px]"
                      data-node-id="1:1478"
                      data-name="Officer access"
                    >
                      <div
                        className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                        data-node-id="1:1479"
                      >
                        <p className="leading-[normal]">✓</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
              <div
                className="bg-[#fef0ef] content-stretch flex flex-col gap-[12px] items-start overflow-clip p-[17px] relative rounded-[12px] shrink-0 w-full"
                data-node-id="1:1480"
                data-name="Security policy"
              >
                <div
                  className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal gap-[8px] items-center not-italic overflow-clip relative shrink-0 text-[#c2413a]"
                  data-node-id="1:1481"
                  data-name="Policy heading"
                >
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[17px] text-[13.6px] text-center"
                    data-node-id="1:1482"
                  >
                    <p className="leading-[normal]">!</p>
                  </div>
                  <p
                    className="leading-[normal] relative shrink-0 text-[12px] whitespace-nowrap"
                    data-node-id="1:1483"
                  >
                    Keamanan akun
                  </p>
                </div>
                <p
                  className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.5] min-w-full not-italic relative shrink-0 text-[#8b433e] text-[10px] w-[min-content]"
                  data-node-id="1:1484"
                >
                  Nonaktifkan akun pegawai yang tidak lagi bertugas. Perubahan
                  peran dan reset kata sandi tercatat di log audit.
                </p>
                <div
                  className="content-stretch flex gap-[7px] items-center overflow-clip relative shrink-0"
                  data-node-id="1:1485"
                  data-name="Policy status"
                >
                  <div
                    className="relative shrink-0 size-[7px]"
                    data-node-id="1:1486"
                    data-name="Indicator"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgIndicator3}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[10px] whitespace-nowrap"
                    data-node-id="1:1487"
                  >
                    Kebijakan akses aktif
                  </p>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
