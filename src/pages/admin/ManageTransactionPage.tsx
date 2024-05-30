import { useEffect, useState } from "react";
import Header from "../../component/Header";
import {
  Badge,
  Button,
  Card,
  Flex,
  SimpleGrid,
  Stack,
  Text,
} from "@mantine/core";
import { TransactionType } from "../../services/api/type";
import Swal from "sweetalert2";
import axios from "../../services/api";
import { getToken } from "../../utils/helpers";

const ManageTransactionPage = () => {
  const [transactions, setTransactions] = useState<TransactionType[] | null>(
    []
  );
  const [callFetch, setCallFetch] = useState(false);

  const refetchTransaction = () => {
    setCallFetch(!callFetch);
  };

  useEffect(() => {
    (async () => {
      try {
        const token = getToken();

        const res = await axios.get(
          "/transactions?method=withdraw&status=pending",
          { headers: { Authorization: `Bearer ${token}` } }
        );
        const { result } = res.data;
        setTransactions(result);
      } catch (err) {
        console.log(err);
        Swal.fire({
          icon: "error",
          text: "Tải giao dịch không thành công",
          confirmButtonColor: "#6ee3a5",
        });
      }
    })();
  }, [callFetch]);

  const convertDate = (date: string) => {
    return new Date(date).toLocaleString("th-TH");
  };

  const handleUpdateStatusTransaction = async (
    transaction: TransactionType,
    status: string
  ) => {
    try {
      const token = getToken();

      await axios.put(
        `/users/${transaction.userId}/transactions/${transaction.id}`,
        {
          status,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      refetchTransaction();

      Swal.fire({
        icon: "success",
        text: `Cập nhật trạng thái giao dịch thành công`,
        confirmButtonColor: "#6ee3a5",
      });
    } catch (err) {
      console.log(err);
      Swal.fire({
        icon: "error",
        text: "Phê duyệt giao dịch không thành công, vui lòng thử lại",
        confirmButtonColor: "#6ee3a5",
      });
    }
  };

  return (
    <div>
      <Header title="Quản trị viên Quản lý giao dịch" />
      <Stack gap="16px" style={{ padding: "16px 24px 24px 24px" }}>
        <Flex justify={"end"}>
          <Button color="cyan" onClick={refetchTransaction}>
            Refresh
          </Button>
        </Flex>
        <SimpleGrid cols={{ base: 1, sm: 2 }}>
          {transactions?.map((transaction) => (
            <Card
              shadow="sm"
              padding="lg"
              radius="md"
              withBorder
              key={transaction.id}
            >
              <Stack gap={4}>
                <Flex justify={"space-between"} align={"center"}>
                  <Text>User id: {transaction.userId}</Text>
                  <Badge color="yellow">{transaction.status}</Badge>
                </Flex>
                <Text>Method: {transaction.method}</Text>
                <Text>Amount: {transaction.amount * -1}</Text>
                <Text>Date: {convertDate(transaction.createdAt)}</Text>
              </Stack>

              <Flex gap={"xs"}>
                <Button
                  color="green"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() =>
                    handleUpdateStatusTransaction(transaction, "success")
                  }
                >
                  Approve
                </Button>
                <Button
                  color="red"
                  fullWidth
                  mt="md"
                  radius="md"
                  onClick={() =>
                    handleUpdateStatusTransaction(transaction, "failed")
                  }
                >
                  Reject
                </Button>
              </Flex>
            </Card>
          ))}
        </SimpleGrid>
      </Stack>
    </div>
  );
};

export default ManageTransactionPage;