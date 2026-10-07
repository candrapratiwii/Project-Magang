const assetPathPrefix = "/assets"
const imgIndicator = `${assetPathPrefix}/3a5de.svg`
const imgIndicator1 = `${assetPathPrefix}/27f4c.svg`

export default function LaporanPersediaanScreen() {
  return (
    <div
      className="bg-[#f3f6fa] content-stretch flex items-start relative size-full"
      data-node-id="1:1093"
      data-name="Laporan Persediaan screen"
    >
      <div
        className="bg-[#102a43] content-stretch flex flex-col gap-[22px] items-start min-h-[1024px] overflow-clip pb-[20px] pt-[24px] px-[22px] relative self-stretch shrink-0 w-[244px]"
        data-node-id="1:1094"
        data-name="Sidebar"
      >
        <p
          className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[15px] text-white w-full"
          data-node-id="1:1095"
        >
          SIMPERA-NET
        </p>
        <p
          className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#d5e2ef] text-[12px] w-full"
          data-node-id="1:1096"
        >
          Bidang Teknologi dan Informasi
        </p>
        <div
          className="bg-[#29455f] h-px relative shrink-0 w-full"
          data-node-id="1:1097"
          data-name="Divider"
        />
        <div
          className="[word-break:break-word] content-stretch flex flex-col gap-[18px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 text-[12px] w-full"
          data-node-id="1:1098"
          data-name="Navigation"
        >
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1099"
          >
            Dashboard
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1100"
          >
            Master Barang
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1101"
          >
            Barang Masuk
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1102"
          >
            Barang Keluar
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1103"
          >
            Stok Opname
          </p>
          <p
            className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#65a1ff] w-full whitespace-pre-wrap"
            data-node-id="1:1104"
          >{`●  Laporan`}</p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:1105"
          >
            Manajemen Pengguna
          </p>
        </div>
      </div>
      <div
        className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-[1100px] min-w-px overflow-clip relative"
        data-node-id="1:1106"
        data-name="Workspace"
      >
        <div
          className="[word-break:break-word] bg-white border-[#dce4ee] border-b border-solid content-stretch flex h-[76px] items-center justify-between leading-[normal] not-italic overflow-clip px-[32px] relative shrink-0 w-full whitespace-nowrap"
          data-node-id="1:1107"
          data-name="Top bar"
        >
          <p
            className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[16px]"
            data-node-id="1:1108"
          >
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p
            className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px]"
            data-node-id="1:1109"
          >
            Ayu Pramesti · Admin
          </p>
        </div>
        <div
          className="content-stretch flex flex-col gap-[24px] items-start overflow-clip p-[32px] relative shrink-0 w-full"
          data-node-id="1:1110"
          data-name="Page content"
        >
          <div
            className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-center justify-between not-italic overflow-clip relative shrink-0 w-full"
            data-node-id="1:1111"
            data-name="Page heading"
          >
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[5px] items-start leading-[normal] min-w-px overflow-clip relative"
              data-node-id="1:1112"
              data-name="Heading copy"
            >
              <p
                className="relative shrink-0 text-[#172b4d] text-[26px] w-full"
                data-node-id="1:1113"
              >
                Laporan Persediaan
              </p>
              <p
                className="relative shrink-0 text-[#64748b] text-[14px] w-full"
                data-node-id="1:1114"
              >
                Tinjau, saring, dan ekspor data transaksi persediaan
              </p>
            </div>
            <div
              className="content-stretch flex gap-[8px] items-start overflow-clip relative shrink-0"
              data-node-id="1:1115"
              data-name="Export actions"
            >
              <div
                className="bg-white border border-[#dce4ee] border-solid content-stretch flex gap-[8px] h-[40px] items-center justify-center overflow-clip px-[15px] relative rounded-[8px] shrink-0 text-[#1769e0]"
                data-node-id="1:1116"
                data-name="Button"
              >
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                  data-node-id="1:1117"
                >
                  <p className="leading-[normal]">◆</p>
                </div>
                <p
                  className="leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap"
                  data-node-id="1:1118"
                >
                  Export Excel
                </p>
              </div>
              <div
                className="bg-[#1769e0] border border-[#1769e0] border-solid content-stretch flex gap-[8px] h-[40px] items-center justify-center overflow-clip px-[15px] relative rounded-[8px] shrink-0 text-white"
                data-node-id="1:1119"
                data-name="Button"
              >
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                  data-node-id="1:1120"
                >
                  <p className="leading-[normal]">◆</p>
                </div>
                <p
                  className="leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap"
                  data-node-id="1:1121"
                >
                  Export PDF
                </p>
              </div>
            </div>
          </div>
          <div
            className="[word-break:break-word] bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-col font-['Inter:Regular'] font-normal gap-[16px] items-start not-italic p-[18px] relative rounded-[12px] shrink-0 w-full"
            data-node-id="1:1122"
            data-name="Report filters"
          >
            <div
              className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
              data-node-id="1:1123"
              data-name="Filter heading"
            >
              <div
                className="content-stretch flex gap-[9px] items-center overflow-clip relative shrink-0"
                data-node-id="1:1124"
                data-name="Heading copy"
              >
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 size-[18px] text-[#1769e0] text-[14.4px] text-center"
                  data-node-id="1:1125"
                >
                  <p className="leading-[normal]">◆</p>
                </div>
                <p
                  className="leading-[normal] relative shrink-0 text-[#172b4d] text-[14px] whitespace-nowrap"
                  data-node-id="1:1126"
                >
                  Filter laporan
                </p>
              </div>
              <p
                className="leading-[normal] relative shrink-0 text-[#1769e0] text-[11px] whitespace-nowrap"
                data-node-id="1:1127"
              >
                Atur ulang
              </p>
            </div>
            <div
              className="content-stretch flex gap-[12px] items-end overflow-clip relative shrink-0 w-full"
              data-node-id="1:1128"
              data-name="Filter controls"
            >
              <div
                className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-w-px overflow-clip relative"
                data-node-id="1:1129"
                data-name="Field"
              >
                <p
                  className="leading-[normal] relative shrink-0 text-[#172b4d] text-[12px] whitespace-nowrap"
                  data-node-id="1:1130"
                >
                  Tanggal mulai
                </p>
                <div
                  className="bg-white border border-[#dce4ee] border-solid content-stretch flex gap-[8px] h-[42px] items-center overflow-clip px-[12px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="1:1131"
                  data-name="Input"
                >
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[#94a3b8] text-[12.8px] text-center"
                    data-node-id="1:1132"
                  >
                    <p className="leading-[normal]">◆</p>
                  </div>
                  <p
                    className="flex-[1_0_0] leading-[normal] min-w-px relative text-[#172b4d] text-[14px]"
                    data-node-id="1:1133"
                  >
                    01 Oktober 2026
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-w-px overflow-clip relative"
                data-node-id="1:1134"
                data-name="Field"
              >
                <p
                  className="leading-[normal] relative shrink-0 text-[#172b4d] text-[12px] whitespace-nowrap"
                  data-node-id="1:1135"
                >
                  Tanggal akhir
                </p>
                <div
                  className="bg-white border border-[#dce4ee] border-solid content-stretch flex gap-[8px] h-[42px] items-center overflow-clip px-[12px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="1:1136"
                  data-name="Input"
                >
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[#94a3b8] text-[12.8px] text-center"
                    data-node-id="1:1137"
                  >
                    <p className="leading-[normal]">◆</p>
                  </div>
                  <p
                    className="flex-[1_0_0] leading-[normal] min-w-px relative text-[#172b4d] text-[14px]"
                    data-node-id="1:1138"
                  >
                    05 Oktober 2026
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-w-px overflow-clip relative"
                data-node-id="1:1139"
                data-name="Field"
              >
                <p
                  className="leading-[normal] relative shrink-0 text-[#172b4d] text-[12px] whitespace-nowrap"
                  data-node-id="1:1140"
                >
                  Jenis transaksi
                </p>
                <div
                  className="bg-white border border-[#dce4ee] border-solid content-stretch flex h-[42px] items-center justify-between overflow-clip px-[12px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="1:1141"
                  data-name="Selection"
                >
                  <p
                    className="leading-[normal] relative shrink-0 text-[#172b4d] text-[14px] whitespace-nowrap"
                    data-node-id="1:1142"
                  >
                    Semua transaksi
                  </p>
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[#64748b] text-[12.8px] text-center"
                    data-node-id="1:1143"
                  >
                    <p className="leading-[normal]">›</p>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch flex flex-[1_0_0] flex-col gap-[7px] items-start min-w-px overflow-clip relative"
                data-node-id="1:1144"
                data-name="Field"
              >
                <p
                  className="leading-[normal] relative shrink-0 text-[#172b4d] text-[12px] whitespace-nowrap"
                  data-node-id="1:1145"
                >
                  Kategori barang
                </p>
                <div
                  className="bg-white border border-[#dce4ee] border-solid content-stretch flex h-[42px] items-center justify-between overflow-clip px-[12px] relative rounded-[8px] shrink-0 w-full"
                  data-node-id="1:1146"
                  data-name="Selection"
                >
                  <p
                    className="leading-[normal] relative shrink-0 text-[#172b4d] text-[14px] whitespace-nowrap"
                    data-node-id="1:1147"
                  >
                    Semua kategori
                  </p>
                  <div
                    className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[#64748b] text-[12.8px] text-center"
                    data-node-id="1:1148"
                  >
                    <p className="leading-[normal]">›</p>
                  </div>
                </div>
              </div>
              <div
                className="bg-[#1769e0] border border-[#1769e0] border-solid content-stretch flex gap-[8px] h-[40px] items-center justify-center overflow-clip px-[15px] relative rounded-[8px] shrink-0 text-white"
                data-node-id="1:1149"
                data-name="Button"
              >
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                  data-node-id="1:1150"
                >
                  <p className="leading-[normal]">⌕</p>
                </div>
                <p
                  className="leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap"
                  data-node-id="1:1151"
                >
                  Terapkan
                </p>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0 w-full"
            data-node-id="1:1152"
            data-name="Report summary"
          >
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[8px]"
              data-node-id="1:1153"
              data-name="Summary card"
            >
              <div
                className="bg-[#eaf2ff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1154"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#1769e0] text-[13.6px] text-center"
                  data-node-id="1:1155"
                >
                  <p className="leading-[normal]">›</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1156"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1157"
                >
                  627
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1158"
                >
                  Total pergerakan
                </p>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[8px]"
              data-node-id="1:1159"
              data-name="Summary card"
            >
              <div
                className="bg-[#eaf8ef] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1160"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#15803d] text-[13.6px] text-center"
                  data-node-id="1:1161"
                >
                  <p className="leading-[normal]">›</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1162"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1163"
                >
                  386
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1164"
                >
                  Barang masuk
                </p>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[8px]"
              data-node-id="1:1165"
              data-name="Summary card"
            >
              <div
                className="bg-[#f2ecff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1166"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#7c3aed] text-[13.6px] text-center"
                  data-node-id="1:1167"
                >
                  <p className="leading-[normal]">›</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1168"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1169"
                >
                  241
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1170"
                >
                  Barang keluar
                </p>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch flex flex-[1_0_0] gap-[12px] items-center min-w-px overflow-clip p-[16px] relative rounded-[8px]"
              data-node-id="1:1171"
              data-name="Summary card"
            >
              <div
                className="bg-[#e6f7fa] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[36px]"
                data-node-id="1:1172"
                data-name="Icon background"
              >
                <div
                  className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#0891b2] text-[13.6px] text-center"
                  data-node-id="1:1173"
                >
                  <p className="leading-[normal]">◆</p>
                </div>
              </div>
              <div
                className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[2px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1174"
                data-name="Summary"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[20px]"
                  data-node-id="1:1175"
                >
                  64
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1176"
                >
                  Total transaksi
                </p>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
            data-node-id="1:1177"
            data-name="Report insights"
          >
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[18px] relative rounded-[12px]"
              data-node-id="1:1178"
              data-name="Transaction trend"
            >
              <div
                className="content-stretch flex items-start justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:1179"
                data-name="Chart heading"
              >
                <div
                  className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[3px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                  data-node-id="1:1180"
                  data-name="Heading copy"
                >
                  <p
                    className="relative shrink-0 text-[#172b4d] text-[14px]"
                    data-node-id="1:1181"
                  >
                    Pergerakan harian
                  </p>
                  <p
                    className="relative shrink-0 text-[#64748b] text-[10px]"
                    data-node-id="1:1182"
                  >
                    1–5 Oktober 2026
                  </p>
                </div>
                <div
                  className="content-stretch flex gap-[12px] items-start overflow-clip relative shrink-0"
                  data-node-id="1:1183"
                  data-name="Legend"
                >
                  <div
                    className="bg-[#eaf8ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                    data-node-id="1:1184"
                    data-name="Status"
                  >
                    <div
                      className="relative shrink-0 size-[6px]"
                      data-node-id="1:1185"
                      data-name="Indicator"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgIndicator}
                      />
                    </div>
                    <p
                      className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[12px] whitespace-nowrap"
                      data-node-id="1:1186"
                    >
                      Masuk
                    </p>
                  </div>
                  <div
                    className="bg-[#f2ecff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                    data-node-id="1:1187"
                    data-name="Status"
                  >
                    <div
                      className="relative shrink-0 size-[6px]"
                      data-node-id="1:1188"
                      data-name="Indicator"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgIndicator1}
                      />
                    </div>
                    <p
                      className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap"
                      data-node-id="1:1189"
                    >
                      Keluar
                    </p>
                  </div>
                </div>
              </div>
              <div
                className="content-stretch flex h-[128px] items-end overflow-clip pt-[8px] relative shrink-0 w-full"
                data-node-id="1:1190"
                data-name="Chart"
              >
                <div
                  className="content-stretch flex flex-col gap-[7px] items-center justify-end overflow-clip relative shrink-0 w-[60px]"
                  data-node-id="1:1191"
                  data-name="Day"
                >
                  <div
                    className="content-stretch flex gap-[5px] h-[92px] items-end overflow-clip relative shrink-0"
                    data-node-id="1:1192"
                    data-name="Bars"
                  >
                    <div
                      className="bg-[#15803d] h-[62px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1193"
                      data-name="Incoming"
                    />
                    <div
                      className="bg-[#7c3aed] h-[38px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1194"
                      data-name="Outgoing"
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[9px] whitespace-nowrap"
                    data-node-id="1:1195"
                  >
                    01 Okt
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[7px] items-center justify-end overflow-clip relative shrink-0 w-[60px]"
                  data-node-id="1:1196"
                  data-name="Day"
                >
                  <div
                    className="content-stretch flex gap-[5px] h-[92px] items-end overflow-clip relative shrink-0"
                    data-node-id="1:1197"
                    data-name="Bars"
                  >
                    <div
                      className="bg-[#15803d] h-[84px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1198"
                      data-name="Incoming"
                    />
                    <div
                      className="bg-[#7c3aed] h-[42px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1199"
                      data-name="Outgoing"
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[9px] whitespace-nowrap"
                    data-node-id="1:1200"
                  >
                    02 Okt
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[7px] items-center justify-end overflow-clip relative shrink-0 w-[60px]"
                  data-node-id="1:1201"
                  data-name="Day"
                >
                  <div
                    className="content-stretch flex gap-[5px] h-[92px] items-end overflow-clip relative shrink-0"
                    data-node-id="1:1202"
                    data-name="Bars"
                  >
                    <div
                      className="bg-[#15803d] h-[46px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1203"
                      data-name="Incoming"
                    />
                    <div
                      className="bg-[#7c3aed] h-[72px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1204"
                      data-name="Outgoing"
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[9px] whitespace-nowrap"
                    data-node-id="1:1205"
                  >
                    03 Okt
                  </p>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[7px] items-center justify-end overflow-clip relative shrink-0 w-[60px]"
                  data-node-id="1:1206"
                  data-name="Day"
                >
                  <div
                    className="content-stretch flex gap-[5px] h-[92px] items-end overflow-clip relative shrink-0"
                    data-node-id="1:1207"
                    data-name="Bars"
                  >
                    <div
                      className="bg-[#15803d] h-[92px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1208"
                      data-name="Incoming"
                    />
                    <div
                      className="bg-[#7c3aed] h-[55px] relative rounded-tl-[4px] rounded-tr-[4px] shrink-0 w-[14px]"
                      data-node-id="1:1209"
                      data-name="Outgoing"
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[9px] whitespace-nowrap"
                    data-node-id="1:1210"
                  >
                    04 Okt
                  </p>
                </div>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-col gap-[14px] items-start p-[18px] relative rounded-[12px] shrink-0 w-[360px]"
              data-node-id="1:1211"
              data-name="Most active items"
            >
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[14px] whitespace-nowrap"
                data-node-id="1:1212"
              >
                Barang paling aktif
              </p>
              <div
                className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full"
                data-node-id="1:1213"
                data-name="Active item"
              >
                <div
                  className="bg-[#f8fafc] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[26px]"
                  data-node-id="1:1214"
                  data-name="Rank"
                >
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap"
                    data-node-id="1:1215"
                  >
                    1
                  </p>
                </div>
                <p
                  className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[#172b4d] text-[11px]"
                  data-node-id="1:1216"
                >
                  Konektor RJ45 Cat6
                </p>
                <p
                  className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[11px] whitespace-nowrap"
                  data-node-id="1:1217"
                >
                  168 pcs
                </p>
              </div>
              <div
                className="content-stretch flex gap-[10px] items-center overflow-clip relative shrink-0 w-full"
                data-node-id="1:1218"
                data-name="Active item"
              >
                <div
                  className="bg-[#f8fafc] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[26px]"
                  data-node-id="1:1219"
                  data-name="Rank"
                >
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] whitespace-nowrap"
                    data-node-id="1:1220"
                  >
                    2
                  </p>
                </div>
                <p
                  className="[word-break:break-word] flex-[1_0_0] font-['Inter:Semi_Bold'] font-semibold leading-[normal] min-w-px not-italic relative text-[#172b4d] text-[11px]"
                  data-node-id="1:1221"
                >
                  Patch Cord Cat6 1m
                </p>
                <p
                  className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#0891b2] text-[11px] whitespace-nowrap"
                  data-node-id="1:1222"
                >
                  74 pcs
                </p>
              </div>
            </div>
          </div>
          <div
            className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-col items-start relative rounded-[12px] shrink-0 w-full"
            data-node-id="1:1223"
            data-name="Report table"
          >
            <div
              className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-center justify-between not-italic overflow-clip p-[17px] relative shrink-0 w-full"
              data-node-id="1:1224"
              data-name="Table heading"
            >
              <div
                className="content-stretch flex flex-col gap-[3px] items-start leading-[normal] overflow-clip relative shrink-0 whitespace-nowrap"
                data-node-id="1:1225"
                data-name="Heading copy"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[14px]"
                  data-node-id="1:1226"
                >
                  Detail transaksi
                </p>
                <p
                  className="relative shrink-0 text-[#64748b] text-[10px]"
                  data-node-id="1:1227"
                >
                  64 transaksi sesuai filter
                </p>
              </div>
              <div
                className="bg-white border border-solid border-white content-stretch flex gap-[8px] h-[40px] items-center justify-center overflow-clip px-[15px] relative rounded-[8px] shrink-0 text-[#64748b]"
                data-node-id="1:1228"
                data-name="Button"
              >
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                  data-node-id="1:1229"
                >
                  <p className="leading-[normal]">◆</p>
                </div>
                <p
                  className="leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap"
                  data-node-id="1:1230"
                >
                  Atur kolom
                </p>
              </div>
            </div>
            <div
              className="[word-break:break-word] bg-[#f8fafc] border-[#dce4ee] border-b border-solid content-stretch flex font-['Inter:Regular'] font-normal gap-[12px] h-[42px] items-center leading-[normal] not-italic px-[16px] relative shrink-0 text-[#64748b] text-[11px] uppercase w-full"
              data-node-id="1:1231"
              data-name="Table header"
            >
              <p className="relative shrink-0 w-[125px]" data-node-id="1:1232">
                Tanggal
              </p>
              <p className="relative shrink-0 w-[105px]" data-node-id="1:1233">
                Nomor
              </p>
              <p className="relative shrink-0 w-[95px]" data-node-id="1:1234">
                Jenis
              </p>
              <p className="relative shrink-0 w-[190px]" data-node-id="1:1235">
                Barang
              </p>
              <p className="relative shrink-0 w-[75px]" data-node-id="1:1236">
                Jumlah
              </p>
              <p className="relative shrink-0 w-[145px]" data-node-id="1:1237">
                Asal / tujuan
              </p>
              <p
                className="flex-[1_0_0] min-w-px relative"
                data-node-id="1:1238"
              >
                Petugas
              </p>
            </div>
            <div
              className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[55px] overflow-clip px-[16px] relative shrink-0 w-full"
              data-node-id="1:1239"
              data-name="Report row"
            >
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] w-[125px]"
                data-node-id="1:1240"
              >
                05 Okt 2026 · 09.14
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[10px] w-[105px]"
                data-node-id="1:1241"
              >
                BK-2026-0108
              </p>
              <div
                className="content-stretch flex items-start overflow-clip relative shrink-0 w-[95px]"
                data-node-id="1:1242"
                data-name="Type"
              >
                <div
                  className="bg-[#f2ecff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                  data-node-id="1:1243"
                  data-name="Status"
                >
                  <div
                    className="relative shrink-0 size-[6px]"
                    data-node-id="1:1244"
                    data-name="Indicator"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgIndicator1}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap"
                    data-node-id="1:1245"
                  >
                    Keluar
                  </p>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[190px]"
                data-node-id="1:1246"
              >
                Access Point Wi-Fi 6
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[75px]"
                data-node-id="1:1247"
              >
                8 unit
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[145px]"
                data-node-id="1:1248"
              >
                Bidang Aptika
              </p>
              <p
                className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[10px]"
                data-node-id="1:1249"
              >
                Ayu Pramesti
              </p>
            </div>
            <div
              className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[55px] overflow-clip px-[16px] relative shrink-0 w-full"
              data-node-id="1:1250"
              data-name="Report row"
            >
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] w-[125px]"
                data-node-id="1:1251"
              >
                05 Okt 2026 · 08.42
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[10px] w-[105px]"
                data-node-id="1:1252"
              >
                BM-2026-0064
              </p>
              <div
                className="content-stretch flex items-start overflow-clip relative shrink-0 w-[95px]"
                data-node-id="1:1253"
                data-name="Type"
              >
                <div
                  className="bg-[#eaf8ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                  data-node-id="1:1254"
                  data-name="Status"
                >
                  <div
                    className="relative shrink-0 size-[6px]"
                    data-node-id="1:1255"
                    data-name="Indicator"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgIndicator}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[12px] whitespace-nowrap"
                    data-node-id="1:1256"
                  >
                    Masuk
                  </p>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[190px]"
                data-node-id="1:1257"
              >
                Konektor RJ45 Cat6
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[75px]"
                data-node-id="1:1258"
              >
                120 pcs
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[145px]"
                data-node-id="1:1259"
              >
                CV Jaringan Bali
              </p>
              <p
                className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[10px]"
                data-node-id="1:1260"
              >
                Made Aditya
              </p>
            </div>
            <div
              className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[55px] overflow-clip px-[16px] relative shrink-0 w-full"
              data-node-id="1:1261"
              data-name="Report row"
            >
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] w-[125px]"
                data-node-id="1:1262"
              >
                04 Okt 2026 · 14.20
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[10px] w-[105px]"
                data-node-id="1:1263"
              >
                BM-2026-0063
              </p>
              <div
                className="content-stretch flex items-start overflow-clip relative shrink-0 w-[95px]"
                data-node-id="1:1264"
                data-name="Type"
              >
                <div
                  className="bg-[#eaf8ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                  data-node-id="1:1265"
                  data-name="Status"
                >
                  <div
                    className="relative shrink-0 size-[6px]"
                    data-node-id="1:1266"
                    data-name="Indicator"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgIndicator}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#15803d] text-[12px] whitespace-nowrap"
                    data-node-id="1:1267"
                  >
                    Masuk
                  </p>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[190px]"
                data-node-id="1:1268"
              >
                Switch Managed 24 Port
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[75px]"
                data-node-id="1:1269"
              >
                6 unit
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[145px]"
                data-node-id="1:1270"
              >
                PT Bali Digital
              </p>
              <p
                className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[10px]"
                data-node-id="1:1271"
              >
                Made Aditya
              </p>
            </div>
            <div
              className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-center min-h-[55px] overflow-clip px-[16px] relative shrink-0 w-full"
              data-node-id="1:1272"
              data-name="Report row"
            >
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] w-[125px]"
                data-node-id="1:1273"
              >
                04 Okt 2026 · 10.05
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[10px] w-[105px]"
                data-node-id="1:1274"
              >
                BK-2026-0107
              </p>
              <div
                className="content-stretch flex items-start overflow-clip relative shrink-0 w-[95px]"
                data-node-id="1:1275"
                data-name="Type"
              >
                <div
                  className="bg-[#f2ecff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                  data-node-id="1:1276"
                  data-name="Status"
                >
                  <div
                    className="relative shrink-0 size-[6px]"
                    data-node-id="1:1277"
                    data-name="Indicator"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgIndicator1}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#7c3aed] text-[12px] whitespace-nowrap"
                    data-node-id="1:1278"
                  >
                    Keluar
                  </p>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Semi_Bold'] font-semibold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[190px]"
                data-node-id="1:1279"
              >
                Patch Cord Cat6 1m
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Bold'] font-bold leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[75px]"
                data-node-id="1:1280"
              >
                24 pcs
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[10px] w-[145px]"
                data-node-id="1:1281"
              >
                UPTD Jaringan
              </p>
              <p
                className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[10px]"
                data-node-id="1:1282"
              >
                Komang Arta
              </p>
            </div>
            <div
              className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic overflow-clip p-[16px] relative shrink-0 text-[10px] w-full"
              data-node-id="1:1283"
              data-name="Table footer"
            >
              <p
                className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] whitespace-nowrap"
                data-node-id="1:1284"
              >
                Menampilkan 1–6 dari 64 transaksi
              </p>
              <p
                className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#1769e0] whitespace-pre"
                data-node-id="1:1285"
              >{`1  ·  2  ·  3  ·  …  ·  11  →`}</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}
