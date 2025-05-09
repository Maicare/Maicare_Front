"use client";

import React, { useState } from "react";
import { ColumnDef, Row } from "@tanstack/react-table";
import { useParams } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { MoreHorizontal, Trash } from "lucide-react";
import PrimaryButton from "@/common/components/PrimaryButton";
import UpsertObjectiveSheet from "./UpsertObjectiveSheet";
import { useGoal } from "@/hooks/goal/use-goal";
import { cn } from "@/utils/cn";
import { dateFormat } from "@/utils/timeFormatting";


export type ObjectiveRow = {
  id: number;
  objective_description: string;
  due_date: string;
  status: string;
  createdAt?: string;
  updatedAt?: string;
};


export const getColumns = (
  handleEdit: (objective: ObjectiveRow) => void,
  handleDelete: (id: number) => void
): ColumnDef<ObjectiveRow>[] => [
    {
      accessorKey: "objective_description",
      header: "Description",
      cell: (ctx) => (
        <span
          className={cn(
            "bg-gray-100 text-gray-800 text-xs font-medium px-2 py-0.5 rounded-sm"
          )}
        >
          {ctx.getValue() as string}
        </span>
      ),
    },
    {
      accessorKey: "due_date",
      header: "Due Date",
      cell: (ctx) => {
        const raw = ctx.getValue() as string;
        const formatted = dateFormat(raw);
        return (
          <span
            className={cn(
              formatted
                ? "bg-yellow-100 text-yellow-800"
                : "bg-red-100 text-red-800",
              "text-xs font-medium px-2 py-0.5 rounded-sm"
            )}
          >
            {formatted || "Not Available"}
          </span>
        );
      },
    },
        {
            accessorKey: "status",
            header: "Status",
            cell: (ctx) => {
              const status = ctx.getValue() as string;
              const bg =
                status === "pending"
                  ? "bg-orange-100 text-orange-800"
                  : "bg-green-100 text-green-800";
              return (
                <span
                  className={cn(bg, "text-xs font-medium px-2 py-0.5 rounded-sm")}
                >
                  {status}
                </span>
              );
            },
          },
    {
      id: "actions",
      header: "",
      cell: ({ row }) => (
        <div className="flex justify-center w-[10px]">
          <ActionsCell
            row={row}
            handleEdit={handleEdit}
            handleDelete={handleDelete}
          />
        </div>
      ),
    },
  ];


const ActionsCell = ({
  row,
  handleEdit,
  handleDelete,
}: {
  row: Row<ObjectiveRow>;
  handleEdit: (objective: ObjectiveRow) => void;
  handleDelete: (id: number) => void;
}) => {
  const [isDeleteOpen, setIsDeleteOpen] = useState(false);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  const { clientId, assessmentId, goalId } = useParams() as {
    clientId: string;
    assessmentId: string;
    goalId: string;
  };

  const { generateObjective, createObjective } = useGoal({
    clientId: Number(clientId),
    assessmentId: Number(assessmentId),
  });

  const handleGenerate = async () => {
    const objs = await generateObjective(Number(goalId), {
      displayProgress: true,
      displaySuccess: true,
    });
    await createObjective(Number(goalId), objs, {
      displayProgress: false,
      displaySuccess: true,
    });
    setMenuOpen(false);
  };

  const openEditSheet = () => setIsEditOpen(true);

  return (
    <>
      <DropdownMenu modal={false} open={menuOpen} onOpenChange={setMenuOpen}>
        <DropdownMenuTrigger asChild onClick={(e) => e.stopPropagation()}>
          <Button variant="ghost" className="h-8 w-8 p-0">
            <span className="sr-only">Open menu</span>
            <MoreHorizontal className="h-4 w-4" />
          </Button>
        </DropdownMenuTrigger>

        <DropdownMenuContent align="end" className="bg-white">
          <DropdownMenuLabel>Actions</DropdownMenuLabel>

          <DropdownMenuItem
            onSelect={(e) => {
              e.preventDefault();
              openEditSheet();
            }}
            className="flex items-center justify-center"
          >
            <UpsertObjectiveSheet
              mode="update"
              isOpen={isEditOpen}
              handleOpen={setIsEditOpen}
              objective={row.original as ObjectiveRow}
              handleCreate={() => { }}
              handleUpdate={() => {
                handleEdit(row.original);
                setIsEditOpen(false);
                setMenuOpen(false);
              }}
              handleGenerate={handleGenerate}
              className="w-full"
            />
          </DropdownMenuItem>

          <DropdownMenuSeparator />

          <DropdownMenuItem
            onClick={() => setIsDeleteOpen(true)}
            className="flex items-center justify-center"
          >
            <PrimaryButton
              text="Delete"
              icon={Trash}
              onClick={() => {
                handleDelete(row.original.id);
                setIsDeleteOpen(false);
              }}
              animation="none"
              className="bg-red-400 text-white hover:bg-red-500 w-full"
            />
          </DropdownMenuItem>
        </DropdownMenuContent>
      </DropdownMenu>

      <AlertDialog open={isDeleteOpen} onOpenChange={setIsDeleteOpen}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Objective</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to delete this objective? This action cannot
              be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter className="flex justify-between">
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={() => {
                handleDelete(row.original.id);
                setIsDeleteOpen(false);
              }}
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </>
  );
};
