#include "mraa.hpp"
#include "altitude.h"
#include <netinet/in.h>
#include <arpa/inet.h>

using namespace std;

int main()
{
    char result[32];
    double altitude;
    struct sockaddr_in addr;
    in_addr_t ipaddr = inet_addr("127.0.0.1");
    int sock = socket(AF_INET, SOCK_DGRAM, 0);
    addr.sin_family = AF_INET;
    addr.sin_port = htons(12345);
    addr.sin_addr.s_addr = INADDR_ANY;

    init();

    if (setsockopt(sock, IPPROTO_IP, IP_MULTICAST_IF, (char *)&ipaddr, sizeof(ipaddr)) != 0)
    {
        perror("setsockopt");
        return 1;
    }

    while(true)
    {
        altitude = update();
        printf("ALTITUDE: %fm\n", altitude);
        sprintf(result, "%f", altitude);
        sendto(sock, result, 7, 0, (struct sockaddr *)&addr, sizeof(addr));
        sleep(1);
    }

    close(sock);
    return MRAA_SUCCESS;
}
