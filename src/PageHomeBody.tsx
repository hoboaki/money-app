import ClassNames from 'classnames';
import * as React from 'react';
import * as LayoutStyle from './Layout.css';
import PageHomeBalance from './PageHomeBalance';
import * as Style from './PageHomeBody.css';
import PageHomeCalendar from './PageHomeCalendar';

class PageHomeBody extends React.Component<any, any> {
  public render() {
    const rootClass = ClassNames(
      Style.Root,
    );
    return (
      <div className={rootClass}>
        <PageHomeCalendar />
        <PageHomeBalance />
        <button className="btn btn-primary" data-toggle="modal" data-target="#basicExampleModal">
          Launch demo modal
        </button>
        <div className="modal fade" id="basicExampleModal" tabIndex={-1}
          role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
          <div className="modal-dialog" role="document">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title" id="exampleModalLabel">Modal title</h5>
                <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                  <span aria-hidden="true">&times;</span>
                </button>
              </div>
              <div className="modal-body">
                ...
              </div>
              <div className="modal-footer">
                <button type="button" className="btn btn-secondary" data-dismiss="modal">Close</button>
                <button type="button" className="btn btn-primary">Save changes</button>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

}

export default PageHomeBody;
