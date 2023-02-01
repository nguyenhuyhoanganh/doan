import icons from "./icons"

const { MdOutlineLibraryMusic, BiDisc, AiOutlineBarChart, MdOutlineContactPage } = icons
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
        text: '#zingchart',
        icons: <AiOutlineBarChart size={24}/>
    },
    {
        path: 'follow',
        text: 'Theo dõi',
        icons: <MdOutlineContactPage size={24}/>
    },
]