import { Epilogue } from 'next/font/google';

export const epilogue = Epilogue({
  subsets: ['latin'],
  // Specify the weights you need
  weight: ['400', '500', '600', '700'],
  // Optional: specify styles if needed
  style: ['normal'],
  // Optional: configure display
  display: 'swap',
  // Optional: specify variable if you want to use it as a CSS variable
  variable: '--font-epilogue',
});