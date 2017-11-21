import React from "react";
import 'bulma/css/bulma.css'
import {Card, Content, Image, Media, MediaItem, Section} from "bulma";

// const CardB =({card})=>{
const CardB = () => {

  return (<Card>
    <Card type="image" size="4by3" src="http://bulma.io/images/placeholders/1280x960.png"/>
    <Card type="content">
      <Media>
        <MediaItem renderAs="figure" position="left">
          <Image renderAs="p" size="64" alt="64x64" src="http://bulma.io/images/placeholders/128x128.png"/>
        </MediaItem>
        <MediaItem>
          <Section size="4">
            John Smith
          </Section>
          <Section subtitle="subtitle" size="6">
            @johnsmith
          </Section>
        </MediaItem>
      </Media>
      <Content>
        Lorem ipsum dolor sit t, consectetur adipiscing elit. Phasellus nec iaculis mauris.
        <a>
          @bulmaio
        </a>
        .
        <a href="#1">
          #css
        </a>

        <a href="#2">
          #responsive
        </a>
        <br/>
        <time dateTime="2016-1-1">
          11:09 PM - 1 Jan 2016
        </time>
      </Content>
    </Card>
  </Card>);
};

export default CardB;
