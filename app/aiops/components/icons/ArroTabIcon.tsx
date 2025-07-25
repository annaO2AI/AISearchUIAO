import React from 'react';

type IconProps = {
  width?: number;
  height?: number;
  color?: string;
  className?: string;
};

export default function ArroTabIcon({
  width = 24,
  height = 24,
  color = "currentColor",
  className = "",
}: IconProps) {
  return (
   <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
      <path d="M5.73966 12.7996C5.43613 12.5177 5.41856 12.0432 5.70041 11.7397L9.22652 8L5.70041 4.26033C5.41856 3.9568 5.43613 3.48225 5.73966 3.2004C6.0432 2.91855 6.51775 2.93613 6.7996 3.23966L10.7996 7.48966C11.0668 7.77742 11.0668 8.22257 10.7996 8.51033L6.7996 12.7603C6.51775 13.0639 6.0432 13.0814 5.73966 12.7996Z" fill="#34334B"/>
   </svg>
  );
}