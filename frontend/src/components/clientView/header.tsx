import Logo from "@/public/images/logo";
import { Member } from "@/services/BlockchainServices";
import { SVGProps } from "react";

type Props = {
  member: Member;
  contractDescription: string;
  children?: React.ReactNode;
};

export default function Header(props: Props) {
  return (
    <div className="bg-wine bg-cover bg-center pb-3">
      <div className="max-w-screen flex min-w-0 flex-row justify-between">
        <div className="m-[10px] h-12 w-12 flex-none">
          <Logo className="fill-isabelline" />
        </div>
        <div className="mx-2 w-2/3 pt-4">
          <p className="overflow-hidden text-ellipsis whitespace-nowrap text-center font-display text-4xl leading-none text-isabelline">
            CVRA
          </p>
          <p className="whites text-center font-display text-xl font-light leading-none text-isabelline">
            sustainable
          </p>
        </div>
        <div className="m-[10px] h-12 w-12 flex-none py-1 pl-1">
          <InfoIcon className="fill-isabelline" />
        </div>
      </div>
      <div
        id="cv-header-description"
        className="linear max-h-[300px] overflow-hidden transition-maxHeight duration-150"
      >
        <div className="m-auto mt-3 h-fit max-h-max w-10/12 overflow-ellipsis rounded-3xl bg-isabelline px-4 py-1 text-center font-body leading-tight text-black drop-shadow-md">
          Producao sustentavel certificada, vinhos do alentejo.
        </div>
      </div>
    </div>
  );
}

const InfoIcon = (props: SVGProps<SVGSVGElement>) => (
  <svg
    className={props.className}
    viewBox="0 0 36 36"
    xmlns="http://www.w3.org/2000/svg"
    fill="currentColor"
    preserveAspectRatio="xMidYMid meet"
  >
    <path d="M18.1191 25.5C18.4397 25.5 18.7063 25.3922 18.9188 25.1766C19.1313 24.9609 19.2375 24.6938 19.2375 24.375V17.625C19.2375 17.3063 19.1291 17.0391 18.9122 16.8234C18.6953 16.6078 18.4265 16.5 18.1059 16.5C17.7853 16.5 17.5188 16.6078 17.3063 16.8234C17.0938 17.0391 16.9875 17.3063 16.9875 17.625V24.375C16.9875 24.6938 17.0959 24.9609 17.3128 25.1766C17.5297 25.3922 17.7985 25.5 18.1191 25.5ZM17.9993 13.725C18.3498 13.725 18.6438 13.61 18.8813 13.38C19.1188 13.15 19.2375 12.865 19.2375 12.525C19.2375 12.1638 19.119 11.8609 18.8819 11.6166C18.6449 11.3722 18.3511 11.25 18.0007 11.25C17.6502 11.25 17.3563 11.3722 17.1188 11.6166C16.8813 11.8609 16.7625 12.1638 16.7625 12.525C16.7625 12.865 16.881 13.15 17.1181 13.38C17.3552 13.61 17.6489 13.725 17.9993 13.725ZM18.01 33C15.9416 33 13.9979 32.6063 12.1787 31.8188C10.3596 31.0313 8.76875 29.9563 7.40625 28.5938C6.04375 27.2313 4.96875 25.6395 4.18125 23.8185C3.39375 21.9975 3 20.0517 3 17.9813C3 15.9108 3.39375 13.965 4.18125 12.144C4.96875 10.323 6.04375 8.7375 7.40625 7.3875C8.76875 6.0375 10.3605 4.96875 12.1815 4.18125C14.0025 3.39375 15.9483 3 18.0188 3C20.0892 3 22.035 3.39375 23.856 4.18125C25.677 4.96875 27.2625 6.0375 28.6125 7.3875C29.9625 8.7375 31.0313 10.325 31.8188 12.15C32.6063 13.975 33 15.9217 33 17.99C33 20.0584 32.6063 22.0021 31.8188 23.8213C31.0313 25.6404 29.9625 27.229 28.6125 28.5869C27.2625 29.9448 25.675 31.0198 23.85 31.8119C22.025 32.604 20.0783 33 18.01 33ZM18.0188 30.75C21.5563 30.75 24.5625 29.5063 27.0375 27.0188C29.5125 24.5313 30.75 21.5188 30.75 17.9813C30.75 14.4438 29.5149 11.4375 27.0446 8.9625C24.5742 6.4875 21.5594 5.25 18 5.25C14.475 5.25 11.4688 6.48515 8.98125 8.95545C6.49375 11.4258 5.25 14.4406 5.25 18C5.25 21.525 6.49375 24.5313 8.98125 27.0188C11.4688 29.5063 14.4813 30.75 18.0188 30.75Z" />
  </svg>
);
