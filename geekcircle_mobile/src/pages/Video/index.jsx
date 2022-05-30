import "./Video.css";
import Bottom from "../../components/Bottom";
import Top from "../../components/Top";

function Video(){

    return (
        <>
            <Top title="视频"/>
            <div className="wrapper">
                <div className="video_item">
                    <p>格力电器将继续发展手机业务，并将向全产业覆盖！</p>
                    <a data-v-4398cef3="" href="#" className="play">
                        <i data-v-4398cef3="" className="van-icon van-icon-play-circle-o"/>
                        <video data-v-4398cef3=""
                               src="https://ips.ifeng.com/video19.ifeng.com/video09/2021/05/26/p6803231351488126976-102-8-161249.mp4?reqtype=tsl&amp;vid=2c791e3b-444e-4578-83e3-f4808228ae3b&amp;uid=0puFR4&amp;from=v_Free&amp;pver=vHTML5Player_v2.0.0&amp;sver=&amp;se=&amp;cat=&amp;ptype=&amp;platform=pc&amp;sourceType=h5&amp;dt=1622096387396&amp;gid=6a4poXmsep1E&amp;sign=39f76885daca6503ebf90acbfffc1ff1&amp;tm=1622096387396"
                               draggable="true" />
                    </a>
                    <span>1563次播放</span>
                </div>
                <div className="video_item">
                    <p>你用上5G了吗？我国5G手机终端达3.1亿 占全球比例超80％</p>
                    <a data-v-4398cef3="" href="#" className="play">
                        <i data-v-4398cef3="" className="van-icon van-icon-play-circle-o"/>
                        <video data-v-4398cef3="" src="https://ips.ifeng.com/video19.ifeng.com/video09/2021/05/26/p6803268684325330944-102-8-184104.mp4?reqtype=tsl&amp;vid=ec74b1e4-d1fa-488b-aaf5-71984ca7d13e&amp;uid=1Vun5L&amp;from=v_Free&amp;pver=vHTML5Player_v2.0.0&amp;sver=&amp;se=&amp;cat=&amp;ptype=&amp;platform=pc&amp;sourceType=h5&amp;dt=1622096310639&amp;gid=fg3vsXmseXFv&amp;sign=38e7c790561e1fd1b57e61a1cbd8031c&amp;tm=1622096310639" />
                    </a>
                    <span>1563次播放</span>
                </div>
            </div>

            <div className="bottom">
                <Bottom />
            </div>
        </>
    )
}
export default Video;
