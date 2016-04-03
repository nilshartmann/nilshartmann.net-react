// ---------------------------------------------------------------------------
// --- Nils Hartmann | http://nilshartmann.net                             ---
// ---------------------------------------------------------------------------
import React from 'react';

import connectModel from '../../model/connectModel';

// see https://www.reddit.com/r/web_design/comments/33kxgf/javascript_copying_to_clipboard_is_easier_than/
function copytext(text) {
    var textField = document.createElement('textarea');
    textField.innerText = text;
    document.body.appendChild(textField);
    textField.select();
    document.execCommand('copy');
    textField.remove();
}

/*
 * See: https://developer.mozilla.org/en-US/docs/Using_files_from_web_applications
 */
class UploadForm extends React.Component {
  constructor(props) {
    super(props);
  }

  componentDidMount() {
    const { listUploads } = this.props;
    listUploads();
  }

  onFileSelected(e) {
    this.setState({
      files: e.target.files
    });
  }

  onUploadFile() {
    const { postForm, listUploads } = this.props;
    const { files } = this.state;

    const data = new FormData();
    data.append('file', files[0]);

    postForm('/api/upload', data)
      .then(()=>listUploads());
  }

  renderUploads(uploads) {
    if (!uploads) {
      return;
    }

    return <div>
      {uploads.map(upload=>
        <div key={upload.file} style={{marginBottom: '30px', textAlign: 'center'}}>
          <a href={`/${upload.file}`} target='_blank'><img src={`/${upload.file}`} style={{width: '200px', margin: '0 auto', 'display': 'block'}} /></a>
          /{upload.file}<button onClick={()=>copytext('/' + upload.file)}>Copy</button>
        </div>
      )}
      </div>;
  }

  render() {
    const uploads = this.props.uploads || [];
    console.log('uploads', uploads);
    return <div>
      <div className='' style={{'borderBottom': '1px solid #FFBB70', 'padding': '20px', 'marginBottom': '20px'}}>
        <input type='file' onChange={e => this.onFileSelected(e)}/>
        <button onClick={() => this.onUploadFile()}>Upload!</button>
      </div>
       {this.renderUploads(uploads)}
    </div>;
  }
}

export default connectModel(UploadForm, ({uploads}) => ({uploads}), ({ postForm, listUploads }) => ({ postForm, listUploads }));

