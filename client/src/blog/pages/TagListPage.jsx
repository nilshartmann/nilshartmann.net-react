// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------

import React from "react";
import { Link } from "react-router";

import connectModel from "../../model/connectModel";

import { tagUrl } from "./../../util/Frontend";
import NavButton from "./../components/NavButton";

class TagListPage extends React.Component {
  constructor(props) {
    super(props);
    this.state = {};
  }

  componentDidMount() {
    const { loadTags, levels } = this.props;
    loadTags(levels);
  }

  render() {
    const { tags } = this.props;
    if (!tags) {
      return null;
    }
    return (
      <div>
        <div className="Row Narrow">Find below a list of all tags used in posts on this blog: </div>

        <div className="Row Narrow TagCloud">
          {tags.map(tag => {
            return (
              <Link key={tag.tag} to={tagUrl(tag.tag)} className={`Button Tag Weight${tag.weight}`}>
                {tag.tag}
              </Link>
            );
          })}
        </div>
        <div className="Row Narrow Center">
          <NavButton url={NavButton.BACK} label="Back" />
          <NavButton url="/" label="Home" />
        </div>
      </div>
    );
  }
}

TagListPage.defaultProps = {
  levels: 3
};

const ConnectedTagListPage = connectModel(TagListPage, ({ tags }) => ({ tags }), ({ loadTags }) => ({ loadTags }));
ConnectedTagListPage.preRender = (props, actions) => actions.loadTags(3);
export default ConnectedTagListPage;
