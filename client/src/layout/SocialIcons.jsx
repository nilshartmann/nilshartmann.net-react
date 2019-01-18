import React from "react";

export default class SocialIcons extends React.Component {
  static defaultProps = {
    icons: [
      {
        icon: "github",
        url: "https://github.com/nilshartmann"
      },
      {
        icon: "twitter",
        url: "https://twitter.com/nilshartmann"
      },
      {
        icon: "camera",
        url: "http://fotos.nilshartmann.net"
      },
      {
        icon: "flickr",
        url: "https://www.flickr.com/photos/nilsha"
      },
      {
        icon: "xing",
        url: "https://www.xing.com/profile/Nils_Hartmann2"
      },
      {
        icon: "envelope",
        url: "mailto:kontakt@nilshartmann.net"
      }
    ]
  };

  constructor(props) {
    super(props);
  }

  render() {
    return (
      <div className="SocialIcons">
        {this.props.icons.map(icon => {
          const iconClassName = `fa fa-${icon.icon} fa-lg`;
          return (
            <a href={icon.url} className="SocialIcon" key={icon.icon} title={icon.icon} target="blank">
              <i className={iconClassName} />
            </a>
          );
        })}
      </div>
    );
  }
}
