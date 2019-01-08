import * as React from 'react';

interface Properties {

  /** The orientation of the children elements within the box. */
  orientation: BoxLayout.Orientation;

  /** The width of the BoxLayout, leaving this value empty results in a width
   *  equal to the width of its contents.
   */
  width?: number | string;

  /** The height of the BoxLayout, leaving this value empty results in a
   *  height equal to the height of its contents.
   */
  height?: number | string;

  /** The unique id of the BoxLayout HTML element. */
  id?: string;

  /** Specifies the CSS class of the BoxLayout HTML element. */
  className?: string;

  /** The CSS style to apply. */
  style?: any;

  /** The event handler called when the mouse enters the region. */
  onMouseEnter?: (event?: React.MouseEvent<any>) => void;

  /** The event handler called when the mouse leaves the region,
      or one of its child components. */
  onMouseOut?: (event?: React.MouseEvent<any>) => void;

  /** The event handler called when the mouse leaves the region. */
  onMouseLeave?: (event?: React.MouseEvent<any>) => void;

  /** The event handler called when the layout is clicked. */
  onClick?: (event?: React.MouseEvent<any>) => void;

  /** Callback receiving the containing DIV element. */
  container?: (container: HTMLDivElement) => void;
}

/** Implements a layout component where children elements subdivide a box either
 *  vertically or horizontally. */
export class BoxLayout extends React.Component<Properties> {
  public static readonly defaultProps = {
    width: '',
    height: ''
  };

  public render(): JSX.Element {
    const outerStyle = Object.assign({}, (this.props.style || {}) as any);
    if(this.props.width !== '') {
      outerStyle.width = this.props.width;
      if(typeof this.props.width === 'number' ||
          (this.props.width as string).endsWith('px')) {
        outerStyle.minWidth = this.props.width;
        outerStyle.maxWidth = this.props.width;
      }
    } else if(this.props.style && this.props.style.width) {
      outerStyle.width = this.props.style.width;
      if(typeof this.props.style.width === 'number' ||
          (this.props.style.width as string).endsWith('px')) {
        outerStyle.minWidth = this.props.style.width;
        outerStyle.maxWidth = this.props.style.width;
      }
    } else if(this.props.style &&
        (this.props.style.minWidth || this.props.style.maxWidth)) {
      if(typeof this.props.width === 'number' ||
          (this.props.width as string).endsWith('px')) {
        outerStyle.minWidth = this.props.style.minWidth;
        outerStyle.maxWidth = this.props.style.maxWidth;
      }
    } else {
      outerStyle.display = 'inline-block';
    }
    if(this.props.height !== '') {
      outerStyle.height = this.props.height;
    }
    const direction = (() => {
      if(this.props.orientation === BoxLayout.Orientation.HORIZONTAL) {
        return 'row';
      } else {
        return 'column';
      }
    })();
    const innerStyle = {
      display: 'flex',
      flexDirection: direction,
      flexBasis: 'auto'
    } as any;
    if(this.props.width !== '') {
      innerStyle.width = this.props.width;
      if(this.props.orientation === BoxLayout.Orientation.HORIZONTAL) {
        if(typeof(this.props.width) === 'string' &&
            this.props.width.endsWith('%')) {
          innerStyle.flexGrow = 1;
          innerStyle.flexShrink = 1;
        } else {
          innerStyle.flexGrow = 0;
          innerStyle.flexShrink = 0;
        }
      }
    } else {
      innerStyle.width = '100%';
      if(this.props.orientation === BoxLayout.Orientation.HORIZONTAL) {
        innerStyle.flexGrow = 1;
        innerStyle.flexShrink = 1;
      }
    }
    if(this.props.height !== '') {
      innerStyle.height = this.props.height;
      if(this.props.orientation === BoxLayout.Orientation.VERTICAL) {
        if(typeof(this.props.width) === 'string' &&
            this.props.width.endsWith('%')) {
          innerStyle.flexGrow = 1;
          innerStyle.flexShrink = 1;
        } else {
          innerStyle.flexGrow = 0;
          innerStyle.flexShrink = 0;
        }
      }
    } else {
      innerStyle.height = '100%';
      if(this.props.orientation === BoxLayout.Orientation.VERTICAL) {
        innerStyle.flexGrow = 1;
        innerStyle.flexShrink = 1;
      }
    }
    const properChildren = React.Children.map(this.props.children,
      (child: any) => {
        if(child === null || child.type === undefined) {
          return child;
        } else if(child.type.name === 'Padding') {
          return React.cloneElement(child,
            {
              orientation: this.props.orientation
            });
        }
        return child;
      });
    return (
      <div id={this.props.id} style={outerStyle}
          onMouseEnter={this.props.onMouseEnter}
          className={this.props.className}
          onMouseOut={this.props.onMouseOut} onClick={this.props.onClick}
          onMouseLeave={this.props.onMouseLeave}
          ref={this.props.container}>
        <div style={innerStyle}>
          {properChildren}
        </div>
      </div>);
  }
}

export namespace BoxLayout {

  /** Specifies whether elements are ordered horizontally or vertically. */
  export enum Orientation {

    /** Elements are layed out side-by-side. */
    HORIZONTAL,

    /** Elements are layed out top-to-bottom. */
    VERTICAL
  }
}
