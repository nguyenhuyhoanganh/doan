import icons from "./icons"

const { MdOutlineLibraryMusic, BiDisc, AiOutlineBarChart, MdOutlineContactPage, BsMicFill, MdPlaylistAdd } = icons
export const sidebarMenu = [
    {
        path: 'mymusic',
        text: 'Cá nhân',
        icons: <MdOutlineLibraryMusic size={24}/>
    },
    {
        path: '',
        text: 'Khám phá',
        end: true,
        icons: <BiDisc size={24}/>
    },
    {
        path: 'zing-chart',
        text: '#Chart',
        icons: <AiOutlineBarChart size={24}/>
    },
    {
        path: 'follow',
        text: 'Theo dõi',
        icons: <MdOutlineContactPage size={24}/>
    },
    {
        path: 'searchbyvoice',
        text: 'Tìm kiếm nhạc',
        icons: <BsMicFill size={24}/>
    },
    {
        path: 'createplaylist',
        text: 'Tạo playlist theo sở thích',
        icons: <MdPlaylistAdd size={24}/>
    },
]