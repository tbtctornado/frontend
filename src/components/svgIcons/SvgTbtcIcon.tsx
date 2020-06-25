import * as React from 'react';

interface Props {
    fill: any;
}

function SvgTbtcIcon(props: Props) {
    return (
        <svg viewBox="0 0 48.273 48.273" height="25px" width="25px" {...props}>
            <path d="M21.226 26.16h-8.052v-5.037h21.924v5.036h-8.051v10.785h-5.821z" fill="#000" />
            <path d="M27.085 14.278a2.949 2.949 0 01-2.949 2.949 2.949 2.949 0 01-2.949-2.949 2.949 2.949 0 012.95-2.949 2.949 2.949 0 012.948 2.949z" />
            <path
                d="M24.136 0C10.833 0-.001 10.832-.001 24.135 0 37.44 10.833 48.273 24.136 48.273c13.304 0 24.137-10.833 24.137-24.137C48.273 10.833 37.44 0 24.136 0zm0 4.497a19.605 19.605 0 0119.639 19.64 19.605 19.605 0 01-19.639 19.638A19.605 19.605 0 014.497 24.136 19.605 19.605 0 0124.136 4.497z"
                color="#000"
                fontWeight={400}
                fontFamily="sans-serif"
                overflow="visible"
            />
        </svg>
    );
}

export default SvgTbtcIcon;
