'use client';

import * as React from 'react';
import { Slot } from '@radix-ui/react-slot';
import { type VariantProps, cva } from 'class-variance-authority';
import { PanelLeft } from 'lucide-react';

import { useIsMobile } from '@/hooks/use-mobile';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Separator } from '@/components/ui/separator';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';
import { Skeleton } from '@/components/ui/skeleton';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { BarChart2, Users, Map, Hash, FileText, ChartLine } from 'lucide-react';

const SIDEBAR_COOKIE_NAME = 'sidebar:state';
const SIDEBAR_COOKIE_MAX_AGE = 60 * 60 * 24 * 7;
const SIDEBAR_WIDTH = '16rem';
const SIDEBAR_WIDTH_ICON = '3rem';
const SIDEBAR_KEYBOARD_SHORTCUT = 'b';

type SidebarContext = {
  state: 'expanded' | 'collapsed';
  open: boolean;
  setOpen: (open: boolean) => void;
  openMobile: boolean;
  setOpenMobile: (open: boolean) => void;
  isMobile: boolean;
  toggleSidebar: () => void;
};

const SidebarContext = React.createContext<SidebarContext | null>(null);

function useSidebar() {
  const context = React.useContext(SidebarContext);
  if (!context) {
    throw new Error('useSidebar must be used within a SidebarProvider.');
  }

  return context;
}

const SidebarProvider = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    defaultOpen?: boolean;
    open?: boolean;
    onOpenChange?: (open: boolean) => void;
  }
>(
  (
    {
      defaultOpen = true,
      open: openProp,
      onOpenChange: setOpenProp,
      className,
      style,
      children,
      ...props
    },
    ref
  ) => {
    const isMobile = useIsMobile();
    const [openMobile, setOpenMobile] = React.useState(false);

    const [_open, _setOpen] = React.useState(defaultOpen);
    const open = openProp ?? _open;
    const setOpen = React.useCallback(
      (value: boolean | ((value: boolean) => boolean)) => {
        const openState = typeof value === 'function' ? value(open) : value;
        if (setOpenProp) {
          setOpenProp(openState);
        } else {
          _setOpen(openState);
        }

        document.cookie = `${SIDEBAR_COOKIE_NAME}=${openState}; path=/; max-age=${SIDEBAR_COOKIE_MAX_AGE}`;
      },
      [setOpenProp, open]
    );

    const toggleSidebar = React.useCallback(() => {
      return isMobile
        ? setOpenMobile((open) => !open)
        : setOpen((open) => !open);
    }, [isMobile, setOpen, setOpenMobile]);

    React.useEffect(() => {
      const handleKeyDown = (event: KeyboardEvent) => {
        if (
          event.key === SIDEBAR_KEYBOARD_SHORTCUT &&
          (event.metaKey || event.ctrlKey)
        ) {
          event.preventDefault();
          toggleSidebar();
        }
      };

      window.addEventListener('keydown', handleKeyDown);
      return () => window.removeEventListener('keydown', handleKeyDown);
    }, [toggleSidebar]);

    const state = open ? 'expanded' : 'collapsed';

    const contextValue = React.useMemo<SidebarContext>(
      () => ({
        state,
        open,
        setOpen,
        isMobile,
        openMobile,
        setOpenMobile,
        toggleSidebar,
      }),
      [state, open, setOpen, isMobile, openMobile, setOpenMobile, toggleSidebar]
    );

    return (
      <SidebarContext.Provider value={contextValue}>
        <TooltipProvider delayDuration={0}>
          <div
            style={
              {
                '--sidebar-width': SIDEBAR_WIDTH,
                '--sidebar-width-icon': SIDEBAR_WIDTH_ICON,
                ...style,
              } as React.CSSProperties
            }
            className={cn(
              'group/sidebar-wrapper flex min-h-svh w-full has-[[data-variant=inset]]:bg-sidebar',
              className
            )}
            ref={ref}
            {...props}
          >
            {children}
          </div>
        </TooltipProvider>
      </SidebarContext.Provider>
    );
  }
);
SidebarProvider.displayName = 'SidebarProvider';

export function Sidebar({
  className,
  onNavigate,
  isMobileOpen,
  onMobileOpenChange,
}: {
  className?: string;
  onNavigate?: () => void;
  isMobileOpen?: boolean;
  onMobileOpenChange?: (open: boolean) => void;
} = {}) {
  const pathname = usePathname();
  const isMobile = useIsMobile();
  const [open, setOpen] = React.useState(false);

  const navItems = [
    {
      icon: (
        <svg
          width='21'
          height='20'
          viewBox='0 0 21 20'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M2.28307 17.7778H19.1132C19.7328 17.7778 20.2352 18.2752 20.2352 18.8889C20.2352 19.5025 19.7328 20 19.1132 20H1.16107C0.541402 20 0.0390625 19.5025 0.0390625 18.8889V1.11111C0.0390625 0.497461 0.541402 0 1.16107 0C1.78073 0 2.28307 0.497461 2.28307 1.11111V17.7778Z'
            fill='#606060'
          />
          <path
            opacity='0.5'
            d='M6.4679 12.982C6.04408 13.4297 5.33404 13.4523 4.88197 13.0326C4.4299 12.6129 4.40699 11.9098 4.83081 11.4621L9.03833 7.01767C9.44821 6.58471 10.1293 6.54717 10.5852 6.9324L13.906 9.73867L18.2328 4.31133C18.6167 3.82969 19.3223 3.74749 19.8087 4.12774C20.295 4.50798 20.378 5.20668 19.9941 5.68832L14.945 12.0217C14.5507 12.5163 13.8202 12.5875 13.3361 12.1784L9.94308 9.31112L6.4679 12.982Z'
            fill='#606060'
          />
        </svg>
      ),
      href: '/',
      label: 'Key Metrics',
    },
    {
      icon: (
        <svg
          width='25'
          height='19'
          viewBox='0 0 25 19'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M7.1629 0.00936881C6.03068 -0.0177418 4.89783 0.0140031 3.76891 0.104372C2.9253 0.0809686 2.1092 0.405833 1.51253 1.00273C0.915839 1.59963 0.591236 2.41573 0.615045 3.2594C0.511323 3.75063 0.479028 4.25438 0.519173 4.75489V14.2459C0.478304 14.7469 0.510281 15.2509 0.61406 15.7426C0.591033 16.5858 0.9161 17.4016 1.51285 17.9978C2.10963 18.5943 2.92553 18.9189 3.76891 18.8953C4.89655 18.9852 6.0281 19.0169 7.15902 18.9903L17.5992 18.9905C18.7315 19.0179 19.8644 18.9861 20.9933 18.8955C21.8368 18.9187 22.6526 18.5936 23.249 17.9969C23.8455 17.4 24.1699 16.5839 24.1462 15.7405C24.2516 15.2497 24.2855 14.7462 24.2468 14.2459L24.2468 4.75489C24.2875 4.25461 24.2555 3.7511 24.1518 3.26009C24.1751 2.41665 23.8502 1.60079 23.2534 1.00412C22.6566 0.407455 21.8405 0.0828224 20.997 0.106457C19.8681 0.0158568 18.7353 -0.0165832 17.603 0.00960052L7.1629 0.00936881ZM7.16266 1.9072H17.6028C19.0265 1.9072 20.0705 1.91299 20.7823 1.9927C21.193 1.91832 21.6142 2.04994 21.9096 2.34491C22.205 2.63965 22.3374 3.06068 22.2638 3.47151C22.3678 3.89091 22.3965 4.32537 22.3483 4.75451L22.3483 5.70361H18.5519C18.4821 5.70269 18.4124 5.70941 18.3441 5.72354C16.3356 5.82897 14.7612 7.48828 14.7612 9.49956C14.7612 11.5108 16.3356 13.1702 18.3441 13.2756C18.4124 13.2904 18.482 13.2974 18.5519 13.2964H22.3483V14.2455C22.3958 14.6744 22.3669 15.1082 22.2629 15.5269C22.3369 15.9378 22.2051 16.3588 21.9101 16.654C21.615 16.9494 21.1941 17.0815 20.7833 17.0076C20.0752 17.0873 19.0227 17.0931 17.6019 17.0931H7.16266C6.80011 17.0931 6.52866 17.0873 6.21356 17.0854V1.91392C6.52866 1.91392 6.79916 1.9072 7.16266 1.9072ZM4.3152 1.97474V17.0265C4.21553 17.0179 4.07222 17.0179 3.98301 17.0075C3.57212 17.0818 3.1508 16.9502 2.85543 16.655C2.56008 16.3598 2.42817 15.9386 2.50241 15.5277C2.39793 15.1088 2.36903 14.6746 2.41699 14.2457V4.75462C2.36923 4.32618 2.39817 3.89241 2.50238 3.47417C2.42797 3.06357 2.5595 2.64231 2.85444 2.34711C3.14939 2.05167 3.57032 1.91959 3.98113 1.99351C4.07034 1.98308 4.21461 1.98308 4.3152 1.97451V1.97474ZM18.5524 7.60268H22.3488V11.3991H18.5524C17.8742 11.3991 17.2476 11.0374 16.9085 10.45C16.5694 9.8626 16.5694 9.13918 16.9085 8.55179C17.2476 7.96439 17.8742 7.60268 18.5524 7.60268ZM18.5504 8.55139C18.0262 8.55139 17.6013 8.97636 17.6013 9.50049C17.6013 10.0246 18.0262 10.4496 18.5504 10.4496C19.0746 10.4496 19.4995 10.0246 19.4995 9.50049C19.4995 8.97636 19.0746 8.55139 18.5504 8.55139Z'
            fill='#606060'
          />
        </svg>
      ),
      href: '/influencer',
      label: 'Influencer',
    },
    {
      icon: (
        <svg
          width='22'
          height='22'
          viewBox='0 0 22 22'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            fillRule='evenodd'
            clipRule='evenodd'
            d='M6.3714 21.9714C2.67757 21.9714 0.115778 19.4087 0.00195312 15.5931V15.3305V6.65304C0.00195312 2.79639 2.45784 0.122843 6.1128 0H6.36835H14.1765C14.7734 0.00243737 15.2671 0.465781 15.3073 1.06147C15.3474 1.65717 14.9203 2.18266 14.329 2.26529L14.1994 2.27528H6.3753C3.94135 2.27528 2.37193 3.86274 2.28211 6.41929V6.664V15.3296C2.28211 17.9673 3.72966 19.5984 6.15569 19.6964H6.38737H15.6171C16.7252 19.7505 17.8044 19.331 18.5852 18.5425C19.3659 17.754 19.775 16.6711 19.7101 15.5633L19.7103 15.3198V7.77227C19.7084 7.17341 20.1719 6.67595 20.7694 6.63524C21.3669 6.59478 21.8933 7.02498 21.9726 7.61848L21.9825 7.74814V15.3247C21.9825 19.1752 19.5266 21.8449 15.8707 21.9677H15.6141L6.3714 21.9714ZM5.37423 14.6398L5.25249 14.5598C4.79597 14.2176 4.66021 13.592 4.93405 13.0913L5.01095 12.9704L8.23863 8.77743C8.58425 8.32847 9.20699 8.20075 9.70117 8.47788L9.82097 8.55685L12.6064 10.7432L15.0494 7.59043C15.4148 7.11953 16.0816 7.01034 16.5781 7.34011C17.0746 7.66989 17.2325 8.32676 16.9403 8.84641L16.8614 8.96633L13.7037 13.0426C13.355 13.4869 12.7346 13.6107 12.2421 13.3341L12.1223 13.2563L9.33995 11.071L6.82812 14.3356C6.61144 14.6154 6.2774 14.7787 5.92362 14.7782C5.73265 14.7792 5.54473 14.7317 5.37728 14.6398H5.37423Z'
            fill='#606060'
          />
        </svg>
      ),
      href: '/demographics',
      label: 'Demographics',
    },
    {
      icon: (
        <svg
          width='35'
          height='28'
          viewBox='0 0 35 28'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
          xmlnsXlink='http://www.w3.org/1999/xlink'
        >
          <rect width='35' height='28' fill='url(#pattern0_2081_9273)' />
          <defs>
            <pattern
              id='pattern0_2081_9273'
              patternContentUnits='objectBoundingBox'
              width='1'
              height='1'
            >
              <use
                xlinkHref='#image0_2081_9273'
                transform='matrix(0.00142857 0 0 0.00178571 0 -0.00267857)'
              />
            </pattern>
            <image
              id='image0_2081_9273'
              width='700'
              height='563'
              preserveAspectRatio='none'
              xlinkHref='data:image/png;base64,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'
            />
          </defs>
        </svg>
      ),
      href: '/world-map',
      label: 'World Map',
    },
    {
      icon: (
        <svg
          width='24'
          height='24'
          viewBox='0 0 24 24'
          fill='none'
          xmlns='http://www.w3.org/2000/svg'
        >
          <path
            d='M8.5 5.87438V15.4994M15.5 8.49938V18.1244M16.087 22.2059L21.7745 19.3621C22.2191 19.1398 22.5 18.6853 22.5 18.1882V3.62305C22.5 2.64736 21.4732 2.01277 20.6005 2.44911L16.087 4.70589C15.7175 4.89065 15.2825 4.89065 14.913 4.70589L9.08697 1.79286C8.71746 1.60811 8.28254 1.60811 7.91303 1.79286L2.22553 4.63661C1.78088 4.85894 1.5 5.31341 1.5 5.81055V20.3757C1.5 21.3514 2.52678 21.986 3.39947 21.5496L7.91303 19.2929C8.28254 19.1081 8.71746 19.1081 9.08697 19.2929L14.913 22.2059C15.2825 22.3906 15.7175 22.3906 16.087 22.2059Z'
            stroke='#606060'
            strokeWidth='2'
            strokeLinecap='round'
            strokeLinejoin='round'
          />
        </svg>
      ),
      href: '/top-themes',
      label: 'Top Themes',
    },
  ];

  const handleNavClick = (href: string) => {
    if (onNavigate) {
      onNavigate();
    }
  };

  const desktopSidebarContent = (
    <div
      className={cn(
        'flex flex-col h-full bg-white border-r border-gray-200',
        className
      )}
    >
      <div className='w-16 flex flex-col items-center py-5 h-full'>
        <div className='flex flex-col items-center space-y-4'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`p-2.5 transition-colors w-11 h-11 flex items-center justify-center
                ${
                  pathname === item.href
                    ? 'bg-[#eef1fe] text-[#3f51b5] border-l-4 border-[#3f51b5]'
                    : 'text-gray-500 hover:bg-gray-100'
                }`}
              title={item.label}
            >
              {item.icon}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  const mobileSidebarContent = (
    <div className='flex flex-col h-full bg-white'>
      <SheetHeader className='p-4 border-b border-gray-200 text-left'>
        <SheetTitle className='text-lg font-semibold text-gray-900'>
          Main Menu
        </SheetTitle>
      </SheetHeader>
      <div className='flex-1 px-4 py-6'>
        <div className='space-y-2'>
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              onClick={() => handleNavClick(item.href)}
              className={`flex items-center px-4 py-3 text-sm font-medium rounded-lg transition-colors
                ${
                  pathname === item.href
                    ? 'bg-[#eef1fe] text-[#3f51b5]'
                    : 'text-gray-700 hover:bg-gray-100 hover:text-gray-900'
                }`}
            >
              {typeof item.icon === 'function' ? (
                <item.icon className='w-5 h-5 mr-3' />
              ) : (
                item.icon
              )}
              {item.label}
            </Link>
          ))}
        </div>
      </div>
    </div>
  );

  if (isMobile && isMobileOpen !== undefined && onMobileOpenChange) {
    return (
      <Sheet open={isMobileOpen} onOpenChange={onMobileOpenChange}>
        <SheetContent side='left' className='p-0 w-80 sm:w-96'>
          {mobileSidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  if (isMobile) {
    return (
      <Sheet open={open} onOpenChange={setOpen}>
        <SheetContent side='left' className='p-0 w-80 sm:w-96'>
          {mobileSidebarContent}
        </SheetContent>
      </Sheet>
    );
  }

  return desktopSidebarContent;
}

const SidebarTrigger = React.forwardRef<
  React.ElementRef<typeof Button>,
  React.ComponentProps<typeof Button>
>(({ className, onClick, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <Button
      ref={ref}
      data-sidebar='trigger'
      variant='ghost'
      size='icon'
      className={cn('h-7 w-7', className)}
      onClick={(event) => {
        onClick?.(event);
        toggleSidebar();
      }}
      {...props}
    >
      <PanelLeft />
      <span className='sr-only'>Toggle Sidebar</span>
    </Button>
  );
});
SidebarTrigger.displayName = 'SidebarTrigger';

const SidebarRail = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'>
>(({ className, ...props }, ref) => {
  const { toggleSidebar } = useSidebar();

  return (
    <button
      ref={ref}
      data-sidebar='rail'
      aria-label='Toggle Sidebar'
      tabIndex={-1}
      onClick={toggleSidebar}
      title='Toggle Sidebar'
      className={cn(
        'absolute inset-y-0 z-20 hidden w-4 -translate-x-1/2 transition-all ease-linear after:absolute after:inset-y-0 after:left-1/2 after:w-[2px] hover:after:bg-sidebar-border group-data-[side=left]:-right-4 group-data-[side=right]:left-0 sm:flex',
        '[[data-side=left]_&]:cursor-w-resize [[data-side=right]_&]:cursor-e-resize',
        '[[data-side=left][data-state=collapsed]_&]:cursor-e-resize [[data-side=right][data-state=collapsed]_&]:cursor-w-resize',
        'group-data-[collapsible=offcanvas]:translate-x-0 group-data-[collapsible=offcanvas]:after:left-full group-data-[collapsible=offcanvas]:hover:bg-sidebar',
        '[[data-side=left][data-collapsible=offcanvas]_&]:-right-2',
        '[[data-side=right][data-collapsible=offcanvas]_&]:-left-2',
        className
      )}
      {...props}
    />
  );
});
SidebarRail.displayName = 'SidebarRail';

const SidebarInset = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'main'>
>(({ className, ...props }, ref) => {
  return (
    <main
      ref={ref}
      className={cn(
        'relative flex min-h-svh flex-1 flex-col bg-background',
        'peer-data-[variant=inset]:min-h-[calc(100svh-theme(spacing.4))] md:peer-data-[variant=inset]:m-2 md:peer-data-[state=collapsed]:peer-data-[variant=inset]:ml-2 md:peer-data-[variant=inset]:ml-0 md:peer-data-[variant=inset]:rounded-xl md:peer-data-[variant=inset]:shadow',
        className
      )}
      {...props}
    />
  );
});
SidebarInset.displayName = 'SidebarInset';

const SidebarInput = React.forwardRef<
  React.ElementRef<typeof Input>,
  React.ComponentProps<typeof Input>
>(({ className, ...props }, ref) => {
  return (
    <Input
      ref={ref}
      data-sidebar='input'
      className={cn(
        'h-8 w-full bg-background shadow-none focus-visible:ring-2 focus-visible:ring-sidebar-ring',
        className
      )}
      {...props}
    />
  );
});
SidebarInput.displayName = 'SidebarInput';

const SidebarHeader = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar='header'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
});
SidebarHeader.displayName = 'SidebarHeader';

const SidebarFooter = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar='footer'
      className={cn('flex flex-col gap-2 p-2', className)}
      {...props}
    />
  );
});
SidebarFooter.displayName = 'SidebarFooter';

const SidebarSeparator = React.forwardRef<
  React.ElementRef<typeof Separator>,
  React.ComponentProps<typeof Separator>
>(({ className, ...props }, ref) => {
  return (
    <Separator
      ref={ref}
      data-sidebar='separator'
      className={cn('mx-2 w-auto bg-sidebar-border', className)}
      {...props}
    />
  );
});
SidebarSeparator.displayName = 'SidebarSeparator';

const SidebarContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar='content'
      className={cn(
        'flex min-h-0 flex-1 flex-col gap-2 overflow-auto group-data-[collapsible=icon]:overflow-hidden',
        className
      )}
      {...props}
    />
  );
});
SidebarContent.displayName = 'SidebarContent';

const SidebarGroup = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => {
  return (
    <div
      ref={ref}
      data-sidebar='group'
      className={cn('relative flex w-full min-w-0 flex-col p-2', className)}
      {...props}
    />
  );
});
SidebarGroup.displayName = 'SidebarGroup';

const SidebarGroupLabel = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'div';

  return (
    <Comp
      ref={ref}
      data-sidebar='group-label'
      className={cn(
        'duration-200 flex h-8 shrink-0 items-center rounded-md px-2 text-xs font-medium text-sidebar-foreground/70 outline-none ring-sidebar-ring transition-[margin,opa] ease-linear focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        'group-data-[collapsible=icon]:-mt-8 group-data-[collapsible=icon]:opacity-0',
        className
      )}
      {...props}
    />
  );
});
SidebarGroupLabel.displayName = 'SidebarGroupLabel';

const SidebarGroupAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & { asChild?: boolean }
>(({ className, asChild = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar='group-action'
      className={cn(
        'absolute right-3 top-3.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 [&>svg]:size-4 [&>svg]:shrink-0',
        // Increases the hit area of the button on mobile.
        'after:absolute after:-inset-2 after:md:hidden',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
});
SidebarGroupAction.displayName = 'SidebarGroupAction';

const SidebarGroupContent = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar='group-content'
    className={cn('w-full text-sm', className)}
    {...props}
  />
));
SidebarGroupContent.displayName = 'SidebarGroupContent';

const SidebarMenu = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar='menu'
    className={cn('flex w-full min-w-0 flex-col gap-1', className)}
    {...props}
  />
));
SidebarMenu.displayName = 'SidebarMenu';

const SidebarMenuItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ className, ...props }, ref) => (
  <li
    ref={ref}
    data-sidebar='menu-item'
    className={cn('group/menu-item relative', className)}
    {...props}
  />
));
SidebarMenuItem.displayName = 'SidebarMenuItem';

const sidebarMenuButtonVariants = cva(
  'peer/menu-button flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-sm outline-none ring-sidebar-ring transition-[width,height,padding] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 group-has-[[data-sidebar=menu-action]]/menu-item:pr-8 aria-disabled:pointer-events-none aria-disabled:opacity-50 data-[active=true]:bg-sidebar-accent data-[active=true]:font-medium data-[active=true]:text-sidebar-accent-foreground data-[state=open]:hover:bg-sidebar-accent data-[state=open]:hover:text-sidebar-accent-foreground group-data-[collapsible=icon]:!size-8 group-data-[collapsible=icon]:!p-2 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0',
  {
    variants: {
      variant: {
        default: 'hover:bg-sidebar-accent hover:text-sidebar-accent-foreground',
        outline:
          'bg-background shadow-[0_0_0_1px_hsl(var(--sidebar-border))] hover:bg-sidebar-accent hover:text-sidebar-accent-foreground hover:shadow-[0_0_0_1px_hsl(var(--sidebar-accent))]',
      },
      size: {
        default: 'h-8 text-sm',
        sm: 'h-7 text-xs',
        lg: 'h-12 text-sm group-data-[collapsible=icon]:!p-0',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'default',
    },
  }
);

const SidebarMenuButton = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    isActive?: boolean;
    tooltip?: string | React.ComponentProps<typeof TooltipContent>;
  } & VariantProps<typeof sidebarMenuButtonVariants>
>(
  (
    {
      asChild = false,
      isActive = false,
      variant = 'default',
      size = 'default',
      tooltip,
      className,
      ...props
    },
    ref
  ) => {
    const Comp = asChild ? Slot : 'button';
    const { isMobile, state } = useSidebar();

    const button = (
      <Comp
        ref={ref}
        data-sidebar='menu-button'
        data-size={size}
        data-active={isActive}
        className={cn(sidebarMenuButtonVariants({ variant, size }), className)}
        {...props}
      />
    );

    if (!tooltip) {
      return button;
    }

    if (typeof tooltip === 'string') {
      tooltip = {
        children: tooltip,
      };
    }

    return (
      <Tooltip>
        <TooltipTrigger asChild>{button}</TooltipTrigger>
        <TooltipContent
          side='right'
          align='center'
          hidden={state !== 'collapsed' || isMobile}
          {...tooltip}
        />
      </Tooltip>
    );
  }
);
SidebarMenuButton.displayName = 'SidebarMenuButton';

const SidebarMenuAction = React.forwardRef<
  HTMLButtonElement,
  React.ComponentProps<'button'> & {
    asChild?: boolean;
    showOnHover?: boolean;
  }
>(({ className, asChild = false, showOnHover = false, ...props }, ref) => {
  const Comp = asChild ? Slot : 'button';

  return (
    <Comp
      ref={ref}
      data-sidebar='menu-action'
      className={cn(
        'absolute right-1 top-1.5 flex aspect-square w-5 items-center justify-center rounded-md p-0 text-sidebar-foreground outline-none ring-sidebar-ring transition-transform hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 peer-hover/menu-button:text-sidebar-accent-foreground [&>svg]:size-4 [&>svg]:shrink-0',
        'after:absolute after:-inset-2 after:md:hidden',
        'peer-data-[size=sm]/menu-button:top-1',
        'peer-data-[size=default]/menu-button:top-1.5',
        'peer-data-[size=lg]/menu-button:top-2.5',
        'group-data-[collapsible=icon]:hidden',
        showOnHover &&
          'group-focus-within/menu-item:opacity-100 group-hover/menu-item:opacity-100 data-[state=open]:opacity-100 peer-data-[active=true]/menu-button:text-sidebar-accent-foreground md:opacity-0',
        className
      )}
      {...props}
    />
  );
});
SidebarMenuAction.displayName = 'SidebarMenuAction';

const SidebarMenuBadge = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'>
>(({ className, ...props }, ref) => (
  <div
    ref={ref}
    data-sidebar='menu-badge'
    className={cn(
      'absolute right-1 flex h-5 min-w-5 items-center justify-center rounded-md px-1 text-xs font-medium tabular-nums text-sidebar-foreground select-none pointer-events-none',
      'peer-hover/menu-button:text-sidebar-accent-foreground peer-data-[active=true]/menu-button:text-sidebar-accent-foreground',
      'peer-data-[size=sm]/menu-button:top-1',
      'peer-data-[size=default]/menu-button:top-1.5',
      'peer-data-[size=lg]/menu-button:top-2.5',
      'group-data-[collapsible=icon]:hidden',
      className
    )}
    {...props}
  />
));
SidebarMenuBadge.displayName = 'SidebarMenuBadge';

const SidebarMenuSkeleton = React.forwardRef<
  HTMLDivElement,
  React.ComponentProps<'div'> & {
    showIcon?: boolean;
  }
>(({ className, showIcon = false, ...props }, ref) => {
  const width = React.useMemo(() => {
    return `${Math.floor(Math.random() * 40) + 50}%`;
  }, []);

  return (
    <div
      ref={ref}
      data-sidebar='menu-skeleton'
      className={cn('rounded-md h-8 flex gap-2 px-2 items-center', className)}
      {...props}
    >
      {showIcon && (
        <Skeleton
          className='size-4 rounded-md'
          data-sidebar='menu-skeleton-icon'
        />
      )}
      <Skeleton
        className='h-4 flex-1 max-w-[--skeleton-width]'
        data-sidebar='menu-skeleton-text'
        style={
          {
            '--skeleton-width': width,
          } as React.CSSProperties
        }
      />
    </div>
  );
});
SidebarMenuSkeleton.displayName = 'SidebarMenuSkeleton';

const SidebarMenuSub = React.forwardRef<
  HTMLUListElement,
  React.ComponentProps<'ul'>
>(({ className, ...props }, ref) => (
  <ul
    ref={ref}
    data-sidebar='menu-sub'
    className={cn(
      'mx-3.5 flex min-w-0 translate-x-px flex-col gap-1 border-l border-sidebar-border px-2.5 py-0.5',
      'group-data-[collapsible=icon]:hidden',
      className
    )}
    {...props}
  />
));
SidebarMenuSub.displayName = 'SidebarMenuSub';

const SidebarMenuSubItem = React.forwardRef<
  HTMLLIElement,
  React.ComponentProps<'li'>
>(({ ...props }, ref) => <li ref={ref} {...props} />);
SidebarMenuSubItem.displayName = 'SidebarMenuSubItem';

const SidebarMenuSubButton = React.forwardRef<
  HTMLAnchorElement,
  React.ComponentProps<'a'> & {
    asChild?: boolean;
    size?: 'sm' | 'md';
    isActive?: boolean;
  }
>(({ asChild = false, size = 'md', isActive, className, ...props }, ref) => {
  const Comp = asChild ? Slot : 'a';

  return (
    <Comp
      ref={ref}
      data-sidebar='menu-sub-button'
      data-size={size}
      data-active={isActive}
      className={cn(
        'flex h-7 min-w-0 -translate-x-px items-center gap-2 overflow-hidden rounded-md px-2 text-sidebar-foreground outline-none ring-sidebar-ring hover:bg-sidebar-accent hover:text-sidebar-accent-foreground focus-visible:ring-2 active:bg-sidebar-accent active:text-sidebar-accent-foreground disabled:pointer-events-none disabled:opacity-50 aria-disabled:pointer-events-none aria-disabled:opacity-50 [&>span:last-child]:truncate [&>svg]:size-4 [&>svg]:shrink-0 [&>svg]:text-sidebar-accent-foreground',
        'data-[active=true]:bg-sidebar-accent data-[active=true]:text-sidebar-accent-foreground',
        size === 'sm' && 'text-xs',
        size === 'md' && 'text-sm',
        'group-data-[collapsible=icon]:hidden',
        className
      )}
      {...props}
    />
  );
});
SidebarMenuSubButton.displayName = 'SidebarMenuSubButton';

export {
  SidebarContent,
  SidebarFooter,
  SidebarGroup,
  SidebarGroupAction,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarHeader,
  SidebarInput,
  SidebarInset,
  SidebarMenu,
  SidebarMenuAction,
  SidebarMenuBadge,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarMenuSkeleton,
  SidebarMenuSub,
  SidebarMenuSubButton,
  SidebarMenuSubItem,
  SidebarProvider,
  SidebarRail,
  SidebarSeparator,
  SidebarTrigger,
  useSidebar,
};
