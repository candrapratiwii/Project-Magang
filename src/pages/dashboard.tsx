const assetPathPrefix = "/assets"
const imgIndicator = `${assetPathPrefix}/e693b.svg`
const imgIndicator1 = `${assetPathPrefix}/9f710.svg`

export default function DashboardScreen() {
  return (
    <div
      className="bg-[#f3f6fa] content-stretch flex items-start relative size-full"
      data-node-id="1:60"
      data-name="Dashboard screen"
    >
      <div
        className="bg-[#102a43] content-stretch flex flex-col gap-[22px] items-start min-h-[1024px] overflow-clip pb-[20px] pt-[24px] px-[22px] relative self-stretch shrink-0 w-[244px]"
        data-node-id="1:61"
        data-name="Sidebar"
      >
        <p
          className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[15px] text-white w-full"
          data-node-id="1:62"
        >
          SIMPERA-NET
        </p>
        <p
          className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[1.5] not-italic relative shrink-0 text-[#afc3d6] text-[10px] w-full"
          data-node-id="1:63"
        >
          Sistem Persediaan Infrastruktur TIK
        </p>
        <div
          className="bg-[#29455f] h-px relative shrink-0 w-full"
          data-node-id="1:64"
          data-name="Divider"
        />
        <div
          className="[word-break:break-word] content-stretch flex flex-col gap-[18px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 text-[12px] w-full"
          data-node-id="1:65"
          data-name="Navigation"
        >
          <p
            className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#65a1ff] w-full whitespace-pre-wrap"
            data-node-id="1:66"
          >{`●  Dashboard`}</p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:67"
          >
            Master Barang
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:68"
          >
            Barang Masuk
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:69"
          >
            Barang Keluar
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:70"
          >
            Stok Opname
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:71"
          >
            Laporan
          </p>
          <p
            className="font-['Inter:Medium'] font-medium relative shrink-0 text-[#d7e2ec] w-full"
            data-node-id="1:72"
          >
            Manajemen Pengguna
          </p>
        </div>
      </div>
      <div
        className="content-stretch flex flex-[1_0_0] flex-col items-start min-h-[1120px] min-w-px overflow-clip relative"
        data-node-id="1:73"
        data-name="Workspace"
      >
        <div
          className="[word-break:break-word] bg-white border-[#dce4ee] border-b border-solid content-stretch flex h-[76px] items-center justify-between leading-[normal] not-italic overflow-clip px-[32px] relative shrink-0 w-full whitespace-nowrap"
          data-node-id="1:74"
          data-name="Top bar"
        >
          <p
            className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[16px]"
            data-node-id="1:75"
          >
            Sistem Persediaan Infrastruktur TIK
          </p>
          <p
            className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[12px]"
            data-node-id="1:76"
          >
            Ayu Pramesti · Admin
          </p>
        </div>
        <div
          className="content-stretch flex flex-col gap-[24px] items-start overflow-clip p-[32px] relative shrink-0 w-full"
          data-node-id="1:77"
          data-name="Page content"
        >
          <div
            className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-center justify-between not-italic overflow-clip relative shrink-0 w-full"
            data-node-id="1:78"
            data-name="Page heading"
          >
            <div
              className="content-stretch flex flex-[1_0_0] flex-col gap-[5px] items-start leading-[normal] min-w-px overflow-clip relative"
              data-node-id="1:79"
              data-name="Heading copy"
            >
              <p
                className="relative shrink-0 text-[#172b4d] text-[26px] w-full"
                data-node-id="1:80"
              >
                Dashboard
              </p>
              <p
                className="relative shrink-0 text-[#64748b] text-[14px] w-full"
                data-node-id="1:81"
              >
                Ringkasan kondisi persediaan per 5 Oktober 2026, 09.30 WITA
              </p>
            </div>
            <div
              className="bg-[#1769e0] border border-[#1769e0] border-solid content-stretch flex gap-[8px] h-[40px] items-center justify-center overflow-clip px-[15px] relative rounded-[8px] shrink-0 text-white"
              data-node-id="1:82"
              data-name="Button"
            >
              <div
                className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                data-node-id="1:83"
              >
                <p className="leading-[normal]">+</p>
              </div>
              <p
                className="leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap"
                data-node-id="1:84"
              >
                Catat transaksi
              </p>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[14px] items-start relative shrink-0 w-full"
            data-node-id="1:85"
            data-name="Key performance indicators"
          >
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-[1_0_0] flex-col gap-[14px] items-start min-w-px p-[18px] relative rounded-[12px]"
              data-node-id="1:86"
              data-name="Metric card"
            >
              <div
                className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:87"
                data-name="Metric heading"
              >
                <p
                  className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]"
                  data-node-id="1:88"
                >
                  Total jenis barang
                </p>
                <div
                  className="bg-[#eaf2ff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[34px]"
                  data-node-id="1:89"
                  data-name="Icon background"
                >
                  <div
                    className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#1769e0] text-[13.6px] text-center"
                    data-node-id="1:90"
                  >
                    <p className="leading-[normal]">⌕</p>
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[30px] w-full"
                data-node-id="1:91"
              >
                42
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] w-full"
                data-node-id="1:92"
              >
                +3 sejak bulan lalu
              </p>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-[1_0_0] flex-col gap-[14px] items-start min-w-px p-[18px] relative rounded-[12px]"
              data-node-id="1:93"
              data-name="Metric card"
            >
              <div
                className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:94"
                data-name="Metric heading"
              >
                <p
                  className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]"
                  data-node-id="1:95"
                >
                  Total stok tersedia
                </p>
                <div
                  className="bg-[#e6f7fa] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[34px]"
                  data-node-id="1:96"
                  data-name="Icon background"
                >
                  <div
                    className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#0891b2] text-[13.6px] text-center"
                    data-node-id="1:97"
                  >
                    <p className="leading-[normal]">◆</p>
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[30px] w-full"
                data-node-id="1:98"
              >
                2.847
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] w-full"
                data-node-id="1:99"
              >
                unit di 4 lokasi
              </p>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-[1_0_0] flex-col gap-[14px] items-start min-w-px p-[18px] relative rounded-[12px]"
              data-node-id="1:100"
              data-name="Metric card"
            >
              <div
                className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:101"
                data-name="Metric heading"
              >
                <p
                  className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]"
                  data-node-id="1:102"
                >
                  Barang masuk bulan ini
                </p>
                <div
                  className="bg-[#eaf8ef] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[34px]"
                  data-node-id="1:103"
                  data-name="Icon background"
                >
                  <div
                    className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#15803d] text-[13.6px] text-center"
                    data-node-id="1:104"
                  >
                    <p className="leading-[normal]">›</p>
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[30px] w-full"
                data-node-id="1:105"
              >
                386
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] w-full"
                data-node-id="1:106"
              >
                +18,4% dari September
              </p>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-[1_0_0] flex-col gap-[14px] items-start min-w-px p-[18px] relative rounded-[12px]"
              data-node-id="1:107"
              data-name="Metric card"
            >
              <div
                className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:108"
                data-name="Metric heading"
              >
                <p
                  className="[word-break:break-word] flex-[1_0_0] font-['Inter:Regular'] font-normal leading-[normal] min-w-px not-italic relative text-[#64748b] text-[12px]"
                  data-node-id="1:109"
                >
                  Barang keluar bulan ini
                </p>
                <div
                  className="bg-[#f2ecff] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[34px]"
                  data-node-id="1:110"
                  data-name="Icon background"
                >
                  <div
                    className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[17px] text-[#7c3aed] text-[13.6px] text-center"
                    data-node-id="1:111"
                  >
                    <p className="leading-[normal]">›</p>
                  </div>
                </div>
              </div>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#172b4d] text-[30px] w-full"
                data-node-id="1:112"
              >
                241
              </p>
              <p
                className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[11px] w-full"
                data-node-id="1:113"
              >
                37 transaksi tercatat
              </p>
            </div>
          </div>
          <div
            className="bg-[#fef0ef] border border-[#f3c6c2] border-solid content-stretch flex flex-col gap-[16px] items-start overflow-clip p-[20px] relative rounded-[12px] shrink-0 w-full"
            data-node-id="1:114"
            data-name="Stock alert"
          >
            <div
              className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
              data-node-id="1:115"
              data-name="Alert heading"
            >
              <div
                className="content-stretch flex gap-[12px] items-center overflow-clip relative shrink-0"
                data-node-id="1:116"
                data-name="Alert copy"
              >
                <div
                  className="bg-[#c2413a] content-stretch flex items-center justify-center overflow-clip relative rounded-[8px] shrink-0 size-[38px]"
                  data-node-id="1:117"
                  data-name="Alert icon"
                >
                  <div
                    className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[20px] text-[16px] text-center text-white"
                    data-node-id="1:118"
                  >
                    <p className="leading-[normal]">!</p>
                  </div>
                </div>
                <div
                  className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[3px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                  data-node-id="1:119"
                  data-name="Message"
                >
                  <p
                    className="relative shrink-0 text-[#c2413a] text-[15px]"
                    data-node-id="1:120"
                  >
                    3 barang di bawah stok minimum
                  </p>
                  <p
                    className="relative shrink-0 text-[#8b433e] text-[12px]"
                    data-node-id="1:121"
                  >
                    Segera tindak lanjuti agar operasional jaringan tidak
                    terganggu.
                  </p>
                </div>
              </div>
              <div
                className="[word-break:break-word] bg-white border border-[#dce4ee] border-solid content-stretch flex font-['Inter:Regular'] font-normal gap-[8px] h-[40px] items-center justify-center not-italic overflow-clip px-[15px] relative rounded-[8px] shrink-0 text-[#1769e0]"
                data-node-id="1:122"
                data-name="Button"
              >
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[12.8px] text-center"
                  data-node-id="1:123"
                >
                  <p className="leading-[normal]">›</p>
                </div>
                <p
                  className="leading-[normal] relative shrink-0 text-[14px] whitespace-nowrap"
                  data-node-id="1:124"
                >
                  Lihat semua
                </p>
              </div>
            </div>
            <div
              className="content-stretch flex gap-[10px] items-start overflow-clip relative shrink-0 w-full"
              data-node-id="1:125"
              data-name="Low stock items"
            >
              <div
                className="bg-white content-stretch flex flex-[1_0_0] flex-col gap-[9px] items-start min-w-px overflow-clip p-[14px] relative rounded-[8px]"
                data-node-id="1:126"
                data-name="Low stock item"
              >
                <div
                  className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                  data-node-id="1:127"
                  data-name="Item heading"
                >
                  <p
                    className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold'] font-bold leading-[normal] min-w-px not-italic overflow-hidden relative text-[#172b4d] text-[12px] text-ellipsis whitespace-nowrap"
                    data-node-id="1:128"
                  >
                    SFP Module 1G Single Mode
                  </p>
                  <div
                    className="bg-[#fef0ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                    data-node-id="1:129"
                    data-name="Status"
                  >
                    <div
                      className="relative shrink-0 size-[6px]"
                      data-node-id="1:130"
                      data-name="Indicator"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgIndicator}
                      />
                    </div>
                    <p
                      className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#c2413a] text-[12px] whitespace-nowrap"
                      data-node-id="1:131"
                    >
                      Kritis
                    </p>
                  </div>
                </div>
                <p
                  className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] w-full"
                  data-node-id="1:132"
                >
                  NET-SFP-001 · Rak B-03
                </p>
                <div
                  className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-baseline justify-between leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
                  data-node-id="1:133"
                  data-name="Stock values"
                >
                  <p
                    className="relative shrink-0 text-[#c2413a] text-[17px]"
                    data-node-id="1:134"
                  >
                    4 unit
                  </p>
                  <p
                    className="relative shrink-0 text-[#64748b] text-[10px]"
                    data-node-id="1:135"
                  >
                    minimum 10
                  </p>
                </div>
              </div>
              <div
                className="bg-white content-stretch flex flex-[1_0_0] flex-col gap-[9px] items-start min-w-px overflow-clip p-[14px] relative rounded-[8px]"
                data-node-id="1:136"
                data-name="Low stock item"
              >
                <div
                  className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                  data-node-id="1:137"
                  data-name="Item heading"
                >
                  <p
                    className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold'] font-bold leading-[normal] min-w-px not-italic overflow-hidden relative text-[#172b4d] text-[12px] text-ellipsis whitespace-nowrap"
                    data-node-id="1:138"
                  >
                    Konektor RJ45 Cat6
                  </p>
                  <div
                    className="bg-[#fef0ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                    data-node-id="1:139"
                    data-name="Status"
                  >
                    <div
                      className="relative shrink-0 size-[6px]"
                      data-node-id="1:140"
                      data-name="Indicator"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgIndicator}
                      />
                    </div>
                    <p
                      className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#c2413a] text-[12px] whitespace-nowrap"
                      data-node-id="1:141"
                    >
                      Kritis
                    </p>
                  </div>
                </div>
                <p
                  className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] w-full"
                  data-node-id="1:142"
                >
                  MAT-RJ45-006 · Bin A-12
                </p>
                <div
                  className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-baseline justify-between leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
                  data-node-id="1:143"
                  data-name="Stock values"
                >
                  <p
                    className="relative shrink-0 text-[#c2413a] text-[17px]"
                    data-node-id="1:144"
                  >
                    28 pcs
                  </p>
                  <p
                    className="relative shrink-0 text-[#64748b] text-[10px]"
                    data-node-id="1:145"
                  >
                    minimum 50
                  </p>
                </div>
              </div>
              <div
                className="bg-white content-stretch flex flex-[1_0_0] flex-col gap-[9px] items-start min-w-px overflow-clip p-[14px] relative rounded-[8px]"
                data-node-id="1:146"
                data-name="Low stock item"
              >
                <div
                  className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                  data-node-id="1:147"
                  data-name="Item heading"
                >
                  <p
                    className="[word-break:break-word] flex-[1_0_0] font-['Inter:Bold'] font-bold leading-[normal] min-w-px not-italic overflow-hidden relative text-[#172b4d] text-[12px] text-ellipsis whitespace-nowrap"
                    data-node-id="1:148"
                  >
                    Patch Cord Cat6 1m
                  </p>
                  <div
                    className="bg-[#fef0ef] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                    data-node-id="1:149"
                    data-name="Status"
                  >
                    <div
                      className="relative shrink-0 size-[6px]"
                      data-node-id="1:150"
                      data-name="Indicator"
                    >
                      <img
                        alt=""
                        className="absolute block inset-0 max-w-none size-full"
                        src={imgIndicator}
                      />
                    </div>
                    <p
                      className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#c2413a] text-[12px] whitespace-nowrap"
                      data-node-id="1:151"
                    >
                      Kritis
                    </p>
                  </div>
                </div>
                <p
                  className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#64748b] text-[10px] w-full"
                  data-node-id="1:152"
                >
                  MAT-PC-001 · Rak A-05
                </p>
                <div
                  className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-baseline justify-between leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
                  data-node-id="1:153"
                  data-name="Stock values"
                >
                  <p
                    className="relative shrink-0 text-[#c2413a] text-[17px]"
                    data-node-id="1:154"
                  >
                    12 pcs
                  </p>
                  <p
                    className="relative shrink-0 text-[#64748b] text-[10px]"
                    data-node-id="1:155"
                  >
                    minimum 20
                  </p>
                </div>
              </div>
            </div>
          </div>
          <div
            className="content-stretch flex gap-[16px] items-start relative shrink-0 w-full"
            data-node-id="1:156"
            data-name="Operational overview"
          >
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-[1_0_0] flex-col gap-[18px] items-start min-w-px p-[20px] relative rounded-[12px]"
              data-node-id="1:157"
              data-name="Stock by category"
            >
              <div
                className="content-stretch flex items-center justify-between overflow-clip relative shrink-0 w-full"
                data-node-id="1:158"
                data-name="Card heading"
              >
                <div
                  className="[word-break:break-word] content-stretch flex flex-col font-['Inter:Regular'] font-normal gap-[3px] items-start leading-[normal] not-italic overflow-clip relative shrink-0 whitespace-nowrap"
                  data-node-id="1:159"
                  data-name="Heading copy"
                >
                  <p
                    className="relative shrink-0 text-[#172b4d] text-[16px]"
                    data-node-id="1:160"
                  >
                    Stok per kategori
                  </p>
                  <p
                    className="relative shrink-0 text-[#64748b] text-[11px]"
                    data-node-id="1:161"
                  >
                    Total unit tersedia saat ini
                  </p>
                </div>
                <div
                  className="bg-[#eaf2ff] content-stretch flex gap-[5px] items-center overflow-clip px-[9px] py-[5px] relative rounded-[999px] shrink-0"
                  data-node-id="1:162"
                  data-name="Status"
                >
                  <div
                    className="relative shrink-0 size-[6px]"
                    data-node-id="1:163"
                    data-name="Indicator"
                  >
                    <img
                      alt=""
                      className="absolute block inset-0 max-w-none size-full"
                      src={imgIndicator1}
                    />
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#1769e0] text-[12px] whitespace-nowrap"
                    data-node-id="1:164"
                  >
                    2.847 unit
                  </p>
                </div>
              </div>
              <div
                className="content-stretch flex flex-col gap-[16px] items-start overflow-clip relative shrink-0 w-full"
                data-node-id="1:165"
                data-name="Category chart"
              >
                <div
                  className="content-stretch flex flex-col gap-[7px] items-start overflow-clip relative shrink-0 w-full"
                  data-node-id="1:166"
                  data-name="Category row"
                >
                  <div
                    className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic overflow-clip relative shrink-0 text-[#172b4d] text-[12px] w-full whitespace-nowrap"
                    data-node-id="1:167"
                    data-name="Labels"
                  >
                    <p
                      className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0"
                      data-node-id="1:168"
                    >
                      Material jaringan
                    </p>
                    <p
                      className="font-['Inter:Bold'] font-bold relative shrink-0"
                      data-node-id="1:169"
                    >
                      1.460 unit
                    </p>
                  </div>
                  <div
                    className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[999px] shrink-0 w-full"
                    data-node-id="1:170"
                    data-name="Bar track"
                  >
                    <div
                      className="bg-[#1769e0] h-[8px] relative rounded-[999px] shrink-0 w-[410px]"
                      data-node-id="1:171"
                      data-name="Bar"
                    />
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[7px] items-start overflow-clip relative shrink-0 w-full"
                  data-node-id="1:172"
                  data-name="Category row"
                >
                  <div
                    className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic overflow-clip relative shrink-0 text-[#172b4d] text-[12px] w-full whitespace-nowrap"
                    data-node-id="1:173"
                    data-name="Labels"
                  >
                    <p
                      className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0"
                      data-node-id="1:174"
                    >
                      Perangkat jaringan
                    </p>
                    <p
                      className="font-['Inter:Bold'] font-bold relative shrink-0"
                      data-node-id="1:175"
                    >
                      612 unit
                    </p>
                  </div>
                  <div
                    className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[999px] shrink-0 w-full"
                    data-node-id="1:176"
                    data-name="Bar track"
                  >
                    <div
                      className="bg-[#0891b2] h-[8px] relative rounded-[999px] shrink-0 w-[245px]"
                      data-node-id="1:177"
                      data-name="Bar"
                    />
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[7px] items-start overflow-clip relative shrink-0 w-full"
                  data-node-id="1:178"
                  data-name="Category row"
                >
                  <div
                    className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic overflow-clip relative shrink-0 text-[#172b4d] text-[12px] w-full whitespace-nowrap"
                    data-node-id="1:179"
                    data-name="Labels"
                  >
                    <p
                      className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0"
                      data-node-id="1:180"
                    >
                      Perangkat pendukung
                    </p>
                    <p
                      className="font-['Inter:Bold'] font-bold relative shrink-0"
                      data-node-id="1:181"
                    >
                      435 unit
                    </p>
                  </div>
                  <div
                    className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[999px] shrink-0 w-full"
                    data-node-id="1:182"
                    data-name="Bar track"
                  >
                    <div
                      className="bg-[#7c3aed] h-[8px] relative rounded-[999px] shrink-0 w-[178px]"
                      data-node-id="1:183"
                      data-name="Bar"
                    />
                  </div>
                </div>
                <div
                  className="content-stretch flex flex-col gap-[7px] items-start overflow-clip relative shrink-0 w-full"
                  data-node-id="1:184"
                  data-name="Category row"
                >
                  <div
                    className="[word-break:break-word] content-stretch flex items-start justify-between leading-[normal] not-italic overflow-clip relative shrink-0 text-[#172b4d] text-[12px] w-full whitespace-nowrap"
                    data-node-id="1:185"
                    data-name="Labels"
                  >
                    <p
                      className="font-['Inter:Semi_Bold'] font-semibold relative shrink-0"
                      data-node-id="1:186"
                    >{`Kabel & aksesori`}</p>
                    <p
                      className="font-['Inter:Bold'] font-bold relative shrink-0"
                      data-node-id="1:187"
                    >
                      340 unit
                    </p>
                  </div>
                  <div
                    className="bg-[#f8fafc] content-stretch flex h-[8px] items-start overflow-clip relative rounded-[999px] shrink-0 w-full"
                    data-node-id="1:188"
                    data-name="Bar track"
                  >
                    <div
                      className="bg-[#15803d] h-[8px] relative rounded-[999px] shrink-0 w-[138px]"
                      data-node-id="1:189"
                      data-name="Bar"
                    />
                  </div>
                </div>
              </div>
              <div
                className="[word-break:break-word] bg-[#eaf2ff] content-stretch flex font-['Inter:Regular'] font-normal gap-[9px] items-start not-italic overflow-clip p-[12px] relative rounded-[8px] shrink-0 w-full"
                data-node-id="1:190"
                data-name="Category insight"
              >
                <div
                  className="flex flex-col justify-center leading-[0] relative shrink-0 size-[16px] text-[#1769e0] text-[12.8px] text-center"
                  data-node-id="1:191"
                >
                  <p className="leading-[normal]">◆</p>
                </div>
                <p
                  className="flex-[1_0_0] leading-[1.4] min-w-px relative text-[#0e4fab] text-[11px]"
                  data-node-id="1:192"
                >
                  Material jaringan mencakup 51% dari total persediaan aktif.
                </p>
              </div>
            </div>
            <div
              className="bg-white border border-[#dce4ee] border-solid content-stretch drop-shadow-[0px_8px_12px_rgba(18,49,79,0.07)] flex flex-[1_0_0] flex-col gap-[16px] items-start min-w-px p-[20px] relative rounded-[12px]"
              data-node-id="1:193"
              data-name="Recent activity"
            >
              <div
                className="[word-break:break-word] content-stretch flex font-['Inter:Regular'] font-normal items-center justify-between leading-[normal] not-italic overflow-clip relative shrink-0 w-full whitespace-nowrap"
                data-node-id="1:194"
                data-name="Card heading"
              >
                <p
                  className="relative shrink-0 text-[#172b4d] text-[16px]"
                  data-node-id="1:195"
                >
                  Aktivitas terbaru
                </p>
                <p
                  className="relative shrink-0 text-[#1769e0] text-[11px]"
                  data-node-id="1:196"
                >
                  Lihat semua
                </p>
              </div>
              <div
                className="content-stretch flex flex-col items-start overflow-clip relative shrink-0 w-full"
                data-node-id="1:197"
                data-name="Activity list"
              >
                <div
                  className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-start overflow-clip py-[12px] relative shrink-0 w-full"
                  data-node-id="1:198"
                  data-name="Activity"
                >
                  <div
                    className="bg-[#f2ecff] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[34px]"
                    data-node-id="1:199"
                    data-name="Activity icon"
                  >
                    <div
                      className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#7c3aed] text-[12.8px] text-center"
                      data-node-id="1:200"
                    >
                      <p className="leading-[normal]">−</p>
                    </div>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic overflow-clip relative"
                    data-node-id="1:201"
                    data-name="Activity copy"
                  >
                    <p
                      className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[12px] w-full"
                      data-node-id="1:202"
                    >
                      Barang keluar #BK-2026-0108
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[11px] w-full"
                      data-node-id="1:203"
                    >
                      8 Access Point · Bidang Aptika
                    </p>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[10px] text-right w-[90px]"
                    data-node-id="1:204"
                  >
                    10 menit lalu
                  </p>
                </div>
                <div
                  className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-start overflow-clip py-[12px] relative shrink-0 w-full"
                  data-node-id="1:205"
                  data-name="Activity"
                >
                  <div
                    className="bg-[#eaf8ef] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[34px]"
                    data-node-id="1:206"
                    data-name="Activity icon"
                  >
                    <div
                      className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#15803d] text-[12.8px] text-center"
                      data-node-id="1:207"
                    >
                      <p className="leading-[normal]">+</p>
                    </div>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic overflow-clip relative"
                    data-node-id="1:208"
                    data-name="Activity copy"
                  >
                    <p
                      className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[12px] w-full"
                      data-node-id="1:209"
                    >
                      Barang masuk #BM-2026-0064
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[11px] w-full"
                      data-node-id="1:210"
                    >
                      120 Konektor RJ45 Cat6 · CV Jaringan Bali
                    </p>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[10px] text-right w-[90px]"
                    data-node-id="1:211"
                  >
                    42 menit lalu
                  </p>
                </div>
                <div
                  className="border-[#dce4ee] border-b border-solid content-stretch flex gap-[12px] items-start overflow-clip py-[12px] relative shrink-0 w-full"
                  data-node-id="1:212"
                  data-name="Activity"
                >
                  <div
                    className="bg-[#eaf2ff] content-stretch flex items-center justify-center overflow-clip relative rounded-[999px] shrink-0 size-[34px]"
                    data-node-id="1:213"
                    data-name="Activity icon"
                  >
                    <div
                      className="[word-break:break-word] flex flex-col font-['Inter:Regular'] font-normal justify-center leading-[0] not-italic relative shrink-0 size-[16px] text-[#1769e0] text-[12.8px] text-center"
                      data-node-id="1:214"
                    >
                      <p className="leading-[normal]">✓</p>
                    </div>
                  </div>
                  <div
                    className="[word-break:break-word] content-stretch flex flex-[1_0_0] flex-col gap-[4px] items-start leading-[normal] min-w-px not-italic overflow-clip relative"
                    data-node-id="1:215"
                    data-name="Activity copy"
                  >
                    <p
                      className="font-['Inter:Bold'] font-bold relative shrink-0 text-[#172b4d] text-[12px] w-full"
                      data-node-id="1:216"
                    >
                      Stok opname diselesaikan
                    </p>
                    <p
                      className="font-['Inter:Regular'] font-normal relative shrink-0 text-[#64748b] text-[11px] w-full"
                      data-node-id="1:217"
                    >
                      Periode Oktober 2026 · selisih 2 item
                    </p>
                  </div>
                  <p
                    className="[word-break:break-word] font-['Inter:Regular'] font-normal leading-[normal] not-italic relative shrink-0 text-[#94a3b8] text-[10px] text-right w-[90px]"
                    data-node-id="1:218"
                  >
                    2 jam lalu
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
