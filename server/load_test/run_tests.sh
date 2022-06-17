# bin/sh

for i in {0..7}
do
    TEST_NUMBER=$i artillery run test.yaml &
done

wait

