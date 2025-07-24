import { Card, CardHeader, CardTitle, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from "@/components/ui/table";
import { z } from "zod";
import { PencilIcon, PlusCircle, TrashIcon } from "lucide-react";
import { Dialog, DialogClose, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import PrimaryButton from "@/common/components/PrimaryButton";
import { InvoiceTemplateItem, MultiSelectInvoiceItems } from "./multi-select-invoice-items";
import { useEffect, useState } from "react";
import { useInvoice } from "@/hooks/invoice/use-invoive";
import { useContact } from "@/hooks/contact/use-contact";
import { useParams } from "next/navigation";

// Schema for validation
const invoiceTemplateItemSchema = z.object({
    description: z.string().min(1, "Description is required"),
    item_tag: z.string().min(1, "Tag is required"),
    source_column: z.string().min(1, "Source column is required"),
    source_table: z.string().min(1, "Source table is required"),
});

export type InvoiceTemplateItemForm = z.infer<typeof invoiceTemplateItemSchema> & { id?: number };

interface InvoiceTemplateItemsCardProps {
    items: InvoiceTemplateItemForm[];
}

export function InvoiceTemplateItemsCard({
    items,
}: InvoiceTemplateItemsCardProps) {

    const {contactId} = useParams();
    const { readAllInvoiceTemplate } = useInvoice({ autoFetch: false });
    const { createOneInvoiceTemplate } = useContact({ autoFetch: false });
    const [selectedTemplateIds, setSelectedTemplateIds] = useState<number[]>([]);
    const [allTemplate, setAllTemplate] = useState<InvoiceTemplateItem[]>([]);

    const [_isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const fetchTemplateInvoice = async () => {
            setIsLoading(true);
            const data = await readAllInvoiceTemplate();
            setAllTemplate(data);
            setIsLoading(false);
        }
        fetchTemplateInvoice();
        const ids = items.map(i=>i.id!);
        setSelectedTemplateIds(ids);
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);
    const handleCreateInvoiceTemplate = async() =>{
        try {
            await createOneInvoiceTemplate(selectedTemplateIds,contactId as string,{
                displayProgress:true,
                displaySuccess:true
            });
        } catch (error) {
            console.error(error);
        }
    }
    return (
        <Card className="w-full">
            <CardHeader>
                <CardTitle className="flex justify-between items-center">
                    <span>Invoice Template Items</span>
                    <Dialog>
                        <DialogTrigger asChild>
                            <PrimaryButton
                                text="Add"
                                disabled={false}
                                icon={PlusCircle}
                                animation="animate-bounce"
                                className="ml-auto dark:bg-indigo-800 dark:text-white dark:hover:bg-indigo-500"
                            />
                        </DialogTrigger>
                        <DialogContent className="sm:max-w-[425px]">
                            <DialogHeader>
                                <DialogTitle>Select a from below</DialogTitle>
                                <DialogDescription>
                                    Please select all the required fields to add a new invoice template item.
                                </DialogDescription>
                            </DialogHeader>
                            <div className="grid gap-4">
                                <div className="grid">
                                    <MultiSelectInvoiceItems
                                        items={allTemplate}
                                        selectedIds={selectedTemplateIds}
                                        onSelectChange={setSelectedTemplateIds}
                                        placeholder="Select template items..."
                                    />
                                </div>
                            </div>
                            <DialogFooter>
                                <DialogClose asChild>
                                    <Button variant="outline">Cancel</Button>
                                </DialogClose>
                                <Button type="button" onClick={handleCreateInvoiceTemplate}>Save changes</Button>
                            </DialogFooter>
                        </DialogContent>
                    </Dialog>
                </CardTitle>
            </CardHeader>

            <CardContent>
                {/* Items Table */}
                {items.length > 0 ? (
                    <Table>
                        <TableHeader>
                            <TableRow>
                                <TableHead>Description</TableHead>
                                <TableHead>Source Table</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {items.map((item) => (
                                <TableRow key={item.id}>
                                    <TableCell className="font-medium">{item.description}</TableCell>
                                    <TableCell>{item.source_table}</TableCell>
                                    <TableCell className="text-right space-x-2">
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            onClick={() => { }}
                                        >
                                            <PencilIcon className="h-4 w-4" />
                                        </Button>
                                        <Button
                                            variant="ghost"
                                            size="sm"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => { }}
                                        >
                                            <TrashIcon className="h-4 w-4" />
                                        </Button>
                                    </TableCell>
                                </TableRow>
                            ))}
                        </TableBody>
                    </Table>
                ) : (
                    <div className="text-center py-8 text-muted-foreground">
                        No template items added yet
                    </div>
                )}
            </CardContent>
        </Card>
    );
}