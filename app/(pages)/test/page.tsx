"use client";
import CopyTooltip from '@/common/components/CopyTooltip'
import Button from '@/components/common/Buttons/Button'
import { ArrowRight, ArrowRightCircle, BookMarked, Briefcase, BriefcaseBusiness, Code, GraduationCap, InfoIcon } from 'lucide-react'
import Image from 'next/image'
import React from 'react'

const page = () => {

  return (
    <div className='flex flex-col gap-4'>
      <div className="flex items-start gap-4 w-full">
        <div className="w-[32%] h-[287px] rounded-sm shadow-md bg-white">
          <div className="h-34 bg-indigo-400 text-indigo-600 flex justify-between rounded-sm">
            <div className="p-4">
              <h1 className="">Hello World</h1>
              <p className="text-sm">it will like simplified!</p>
            </div>
            <Image src={"/images/profile-img.png"} width={200} height={100} className="object-cover" alt="profile" />
          </div>
          <div className="p-4 h-31 flex justify-between w-full bg-white">
            <div className="flex flex-col items-start relative w-[30%]">
              <div className="rounded-full border-2 border-white absolute -top-8 left-0">
                <Image src={"/images/avatar-1.jpg"} width={50} height={50} className="rounded-full" alt="profile" />
              </div>
              <div className="mt-10">
                <p className="text-sm font-bold">Bourichi Taha</p>
                <span className='text-xs font-medium text-slate-400'>Admin</span>
              </div>
            </div>
            <div className="w-[60%] flex flex-col justify-between">
              <div className="flex">
                <div className="w-[50%]">
                  <p className="text-xs text-slate-400">Geboortedatum</p>
                  <p className="text-sm font-bold">12/12/2021</p>
                </div>
                <div className="w-[50%]">
                  <p className="text-xs text-slate-400">Geslacht</p>
                  <p className="text-sm font-bold">Female</p>
                </div>
              </div>
              <button className='flex items-center justify-center gap-2 bg-indigo-400 text-white rounded-md py-2 text-sm w-[50%]'>
                <span>View Details</span>
                <ArrowRight size={15} className='arrow-animation' />
              </button>
            </div>
          </div>
        </div>
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
          <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><InfoIcon size={18} className='text-indigo-400' /> Personal Information</h1>
          <p className="mt-4 text-slate-400">
            Lorem ipsum dolor sit amet consectetur adipisicing elit. Quisquam, quidem. description text here.
          </p>
          <div className="mt-4 w-full">
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Full Name:</p>
              <CopyTooltip text="Bourichi Taha">
                <p className="text-sm text-slate-400 ">Bourichi Taha</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Email:</p>
              <CopyTooltip text="bourichi.taha@gmail.com" >
                <p className="text-sm text-slate-400 ">bourichi.taha@gmail.com</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Mobile:</p>
              <CopyTooltip text="+212 626 661 516" >
                <p className="text-sm text-slate-400 ">+212 626 661 516</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Location:</p>
              <CopyTooltip text="Morocco, Tangier" >
                <p className="text-sm text-slate-400 ">Morocco, Tangier</p>
              </CopyTooltip>
            </div>


          </div>
        </div>
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
          <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><Briefcase size={18} className='text-indigo-400' /> Work Information</h1>
          <div className="mt-4 w-full">
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Positie:</p>
              <CopyTooltip text='Niet gespecificeerd'>
                <p className="text-sm text-slate-400 ">Niet gespecificeerd</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Werk E-mail:</p>
              <CopyTooltip text='bourichi.taha@gmail.com' >
                <p className="text-sm text-slate-400 ">bourichi.taha@gmail.com</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Werk Telefoonnummer:</p>
              <CopyTooltip text='+212 626 661 516' >
                <p className="text-sm text-slate-400 ">+212 626 661 516</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Afdeling:</p>
              <CopyTooltip text='Niet gespecificeerd' >
                <p className="text-sm text-slate-400 ">Niet gespecificeerd</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Medewerkernummer:</p>
              <CopyTooltip text='Niet gespecificeerd' >
                <p className="text-sm text-slate-400 ">Niet gespecificeerd</p>
              </CopyTooltip>
            </div>
            <div className="flex items-center w-full py-2 border-b border-slate-200">
              <p className="w-[40%] text-sm text-slate-600 font-bold">Dienstnummer:</p>
              <CopyTooltip text='Niet gespecificeerd' >
                <p className="text-sm text-slate-400 ">Niet gespecificeerd</p>
              </CopyTooltip>
            </div>


          </div>
        </div>
      </div>
      <div className="flex items-start gap-4 w-full">
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
          <div className="flex justify-between items-center">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><BookMarked size={18} className='text-indigo-400' /> Certifications</h1>
            <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
              <span>View All</span>
              <ArrowRight size={15} className='arrow-animation' />
            </Button>
          </div>
          <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-4 ">
            <div className="flex items-start gap-2 relative">
              <ArrowRightCircle size={15} className='text-indigo-400 absolute -left-7.5 top-[2px] arrow-animation' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Frontend Developer</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
            <div className="flex items-start gap-2 relative">
              <ArrowRightCircle size={15} className='absolute -left-7.5 top-[2px]' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Frontend Developer</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
            <div className="flex items-start gap-2 relative mb-6">
              <ArrowRightCircle size={15} className='absolute -left-7.5 top-[2px]' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Frontend Developer</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
          <div className="flex justify-between items-center">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'>
              <GraduationCap size={18} className='text-indigo-400' />  Education
            </h1>
            <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
              <span>View All</span>
              <ArrowRight size={15} className='arrow-animation' />
            </Button>
          </div>
          <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-4">
            <div className="flex items-start gap-2 relative">
              <ArrowRightCircle size={15} className='text-indigo-400 absolute -left-7.5 top-[2px] arrow-animation' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Phd Cybersecurity</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
            <div className="flex items-start gap-2 relative">
              <ArrowRightCircle size={15} className='absolute -left-7.5 top-[2px]' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Master Big Data</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
            <div className="flex items-start gap-2 relative mb-6">
              <ArrowRightCircle size={15} className='absolute -left-7.5 top-[2px]' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Bachelor IT</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
          </div>
        </div>
        <div className="w-[32%] h-[287px] rounded-sm shadow-md p-4 bg-white">
          <div className="flex justify-between items-center">
            <h1 className='flex items-center gap-2 m-0 p-0 font-extrabold text-lg text-slate-600'><BriefcaseBusiness size={18} className='text-indigo-400' />Experiences</h1>
            <Button className='bg-indigo-400 text-white text-xs py-1 px-2 rounded-md flex items-center gap-2 '>
              <span>View All</span>
              <ArrowRight size={15} className='arrow-animation' />
            </Button>
          </div>
          <div className="mt-4 w-full h-max border-l-4 border-dashed border-slate-200 pl-6 p-2 flex flex-col gap-4">
            <div className="flex items-start gap-2 relative">
              <ArrowRightCircle size={15} className='text-indigo-400 absolute -left-7.5 top-[2px] arrow-animation' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Frontend Developer</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
            <div className="flex items-start gap-2 relative">
              <ArrowRightCircle size={15} className='absolute -left-7.5 top-[2px]' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Frontend Developer</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
            <div className="flex items-start gap-2 relative mb-6">
              <ArrowRightCircle size={15} className='absolute -left-7.5 top-[2px]' />
              <Code size={20} className='text-indigo-400' />
              <div className='flex flex-col gap-2'>
                <p className="text-sm text-slate-600 font-bold">Frontend Developer</p>
                <p className="text-xs text-indigo-400 font-medium">2016 - 19</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default page