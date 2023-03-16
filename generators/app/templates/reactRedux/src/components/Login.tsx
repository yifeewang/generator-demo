import React from "react";
import style from  "./Login.less";
import active from "../static/index_active.png";
import data from "../static/no_data.png";

type Props = {};

export default function Home({}: Props) {
  return (
    <div className={style.login}>
        <div>hello</div>
        <div><span>我是</span> login typescript</div>
        <img src={active}/>
        <img src={data}/>
    </div>
  )
}