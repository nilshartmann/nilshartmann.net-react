// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
import React from "react";
import getSlug from "speakingurl";
import marked from "marked";
// import highlightJs from 'highlight.js';
import moment from "moment";

import Button from "../../blog/components/Button";
import TextInputField from "./TextInputField";
import TagEditField from "./TagEditField";
import FullPost from "../../blog/components/FullPost";

marked.setOptions(
  {
    // highlight(code) {
    //   return highlightJs.highlightAuto(code).value;
    // }
  }
);

function emptyPost() {
  const currentDate = new Date();

  return {
    _new: true,
    title: "",
    slug: "",
    _date: new Intl.DateTimeFormat().format(currentDate),
    image: "",
    image_position: "before_summary",
    image_expanded: true,
    summary: "",
    content: "",
    tags: [],
    published: false
  };
}

export default class PostEditor extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      post: this.props.post || emptyPost(),
      errors: {},
      allTags: []
    };
    this.onFieldChange = this.onFieldChange.bind(this);
    this.refreshSlug = this.refreshSlug.bind(this);
    this.save = this.save.bind(this);
    this.setFeedbackMessage = this.setFeedbackMessage.bind(this);
    this.onTagAdd = this.onTagAdd.bind(this);
    this.addFieldError = this.addFieldError.bind(this);

    console.log("POST", this.state.post);
  }

  componentDidMount() {
    const { loadTags } = this.props;
    loadTags();
  }

  componentWillReceiveProps(nextProps) {
    this.setState({ post: nextProps.post || emptyPost() });
  }

  onFieldChange(e) {
    this.updateField(e.target.name, e.target.value);
  }

  onTagAdd(tag) {
    const currentTags = this.state.post.tags;
    if (!currentTags.find(t => t === tag)) {
      currentTags.push(tag);
      this.updateField("tags", currentTags);
    }
  }

  onTagRemove(tag) {
    const currentTags = this.state.post.tags;
    const newTags = currentTags.filter(t => t !== tag);
    this.updateField("tags", newTags);
  }

  addFieldError(field, message) {
    const { errors } = this.state;
    const newErrors = Object.assign({}, errors, { [field]: message });

    this.setState({ errors: newErrors });
  }

  setFeedbackMessage(status, message) {
    this.setState({
      feedbackMessage: {
        status,
        message
      }
    });
  }

  clearFeedbackMessage() {
    this.setState({ feedbackMessage: null });
  }

  updateField(name, value) {
    const newPost = Object.assign({}, this.state.post, { [name]: value });

    if (name === "summary" || name === "content") {
      newPost["_" + name + "Html"] = marked(value);
    }

    this.setState({ post: newPost });
    this.clearFeedbackMessage();
  }

  save() {
    // TODO verify form
    const { savePost } = this.props;
    const { post } = this.state;

    console.log("-------------------- NEW POST: -------------------------");
    const newPost = { ...post };

    if (!newPost.slug || newPost.slug.length < 1) {
      this.setFeedbackMessage("error", "Missing slug");
      return;
    }

    newPost.publish_time = moment(newPost._date, "DD.MM.YYYY");
    console.log(JSON.stringify(newPost));
    console.log("--------------------------------------------------------");

    savePost(newPost)
      .then(({ response }) => {
        console.log("response", response);
        if (response.ok) {
          this.setFeedbackMessage("success", "Post saved");
        } else {
          console.log(response);
          this.setFeedbackMessage("error", `Could not save post: ${response.statusText} (${response.status})`);
        }
      })
      .catch(err => this.setFeedbackMessage("error", "Error while saving post: " + err));
  }

  refreshSlug() {
    const { post } = this.state;

    if (post._new) {
      // updating slug of existing posts not yet possible
      const slug = getSlug(post.title);
      this.updateField("slug", slug);
    }
  }

  render() {
    const { tags: allTags = [] } = this.props;
    const { feedbackMessage, post, errors } = this.state;

    return (
      <div className="Clearfix">
        <div className="Column-2">
          <div className="Row">
            <h1 className="Title">Edit Post</h1>
          </div>
          <div className="Row PostEditor">
            <TextInputField label="Title" value={post.title} onValueChange={this.onFieldChange} />
            <TextInputField
              label="Slug"
              value={post.slug}
              onValueChange={this.onFieldChange}
              onRefresh={this.refreshSlug}
              errorMessage={errors.slug}
              enabled={post._new === true}
            />
            <TextInputField label="Date" name="_date" value={post._date} onValueChange={this.onFieldChange} />
            <TextInputField label="Image (URL)" name="image" value={post.image} onValueChange={this.onFieldChange} />

            <div className="EditorGroup">
              <span style={{ marginRight: "20px" }}>Image position</span>
              <select name="image_position" onChange={this.onFieldChange} value={post.image_position}>
                <option value="before_summary">Before summary</option>
                <option value="left">Left</option>
                <option value="right">Right</option>
                <option value="skip">Skip (no img at all in full view)</option>
              </select>
            </div>
            <div className="EditorGroup">
              <input
                type="checkbox"
                name="image_expanded"
                checked={post.image_expanded}
                onChange={() => this.updateField("image_expanded", !post.image_expanded)}
                className="Control"
              />Show image expanded
            </div>

            <TextInputField
              label="Summary (Markdown)"
              name="summary"
              rows={3}
              value={post.summary}
              onValueChange={this.onFieldChange}
            />
            <TextInputField
              label="Content (Markdown)"
              name="content"
              rows={10}
              value={post.content}
              onValueChange={this.onFieldChange}
            />
            <TagEditField availableTags={allTags} onTag={this.onTagAdd} />
            {post.tags.map(tag => {
              let label = tag;
              if (allTags) {
                const existingTag = allTags.find(candidate => candidate.tag === tag);
                if (existingTag) {
                  label = `${existingTag.tag} (${existingTag.count})`;
                }
              }
              return (
                <div className="Tag" key={tag}>
                  {label}
                  <i
                    className="fa fa-times"
                    onClick={() => {
                      this.onTagRemove(tag);
                    }}
                  />
                </div>
              );
            })}

            <div className="EditorGroup">
              <input disabled={true} type="checkbox" className="Control" />Published
            </div>
            <div className="EditorGroup">
              <Button onClick={this.save}>Save</Button>
            </div>
            {feedbackMessage
              ? <div className={`Alert ${feedbackMessage.status}`}>
                  {feedbackMessage.message}
                </div>
              : null}
          </div>
        </div>
        <div className="Column-2">
          <FullPost post={post} />
        </div>
      </div>
    );
  }
}

PostEditor.propTypes = {
  post: React.PropTypes.object,
  tags: React.PropTypes.array,
  savePost: React.PropTypes.func.isRequired,
  loadTags: React.PropTypes.func.isRequired
};
