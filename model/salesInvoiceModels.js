const prisma = require("../utils/prismaClient");

const findAll = async () => {
    try {
        const invoice = await prisma.salesInvoice.findMany();
        return invoice;
    } catch (error) {
        console.error("Error fetching:", error);
        throw error;
    }
}

const findByID = async (invoiceID) => {
    try {
        const invoice = await prisma.salesInvoice.findUnique({
            where: {
                id: invoiceID
            },
        });
        return invoice;
    } catch (error) {
        console.error("Error fetching by id:", error);
        throw error;
    }
}

const findByReferensiInvoice = async (invoiceReferensi) => {
    try {
        const invoice = await prisma.salesInvoice.findUnique({
            where: {
                referensi_invoice: invoiceReferensi
            },
        });
        return invoice;
    } catch (error) {
        console.error("Error fetching invoice by Referensi:", error);
        throw error;
    }
}

const checkLastReferencedinvoice = async () => {
    try {
        const invoice = await prisma.salesInvoice.findFirst({
            orderBy: {
                referensi_invoice: 'desc',
            },
        });
        return invoice;
    } catch (error) {
        console.error("Error checking last referenced invoice:", error);
        throw error;
    }
}


const findByReferensiQuotation = async (quotationReferensi) => {
    try {
        const invoice = await prisma.salesInvoice.findUnique({
            where: {
                referensi_quotation: quotationReferensi
            },
        });
        return invoice;
    } catch (error) {
        console.error("Error fetching invoice by Referensi:", error);
        throw error;
    }
}

const create = async (data) => {
    try {
        const invoice = await prisma.salesInvoice.create({
            data: data,
        });
        return invoice;
    } catch (error) {
        console.error("Error creating invoice:", error);
        throw error;
    }
}

const update = async (ID, data) => {
    try {
        const invoice = await prisma.salesInvoice.update({
            where: {
                id: ID,
            },
            data: data,
        });
        return invoice;
    } catch (error) {
        console.error("Error update invoice:", error);
        throw error;
    }
}

const destroy = async (ID) => {
    try {
        const deletedinvoice = await prisma.salesInvoice.delete({
            where: {
                id: ID
            }
        });
        return deletedinvoice;
    } catch (error) {
        console.error("Error deleting invoice by ID:", error);
        throw error;
    }
}


const destroybyReferensiQuotation = async (referensiQuotation) => {
    try {
        const deleteData = await prisma.salesInvoice.delete({
            where: {
                referensi_quotation: referensiQuotation
            }
        });
        return deleteData;
    } catch (error) {
        console.error("Error deleting purchase order by ID:", error);
        throw error;
    }
}

const updateStatusInvoice = async (referensi, statusInvoice) => {
    try {
        const updateStatus = await prisma.salesInvoice.update({
            where: {
                referensi_quotation: referensi
            },
            data: { status: statusInvoice.status }
        });

        return updateStatus;
    } catch (error) {
        console.error("Error updating order:", error);
        throw error;
    }
};

const findTop5InvoicesByTotal = async () => {
    try {
        const topInvoices = await prisma.salesInvoice.findMany({
            orderBy: {
                total_pembayaran: 'desc',
            },
            take: 5,
        });
        return topInvoices;
    } catch (error) {
        console.error("Error fetching top 5 invoices by total pembayaran:", error);
        throw error;
    }
};

const getTotalPaidInvoices = async () => {
    try {
        const totalPaid = await prisma.salesInvoice.aggregate({
            _sum: {
                total_pembayaran: true,
            },
            where: {
                status: 'Paid',
            },
        });

        return totalPaid._sum.total_pembayaran || 0; // Kembalikan 0 jika tidak ada data
    } catch (error) {
        console.error("Error calculating total of Paid invoices:", error);
        throw error;
    }
};


module.exports = {
    findAll,
    findByID,
    findByReferensiInvoice,
    findByReferensiQuotation,
    checkLastReferencedinvoice,
    create,
    update,
    destroy,
    destroybyReferensiQuotation,
    updateStatusInvoice,
    findTop5InvoicesByTotal,
    getTotalPaidInvoices
}